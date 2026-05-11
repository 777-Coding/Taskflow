import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../services/api";
import { useToast } from "../hooks/useToast";
import { todayStr, diffDays, sortTasks } from "../utils/dateHelpers";
import { Toast } from "../components/Toast";
import { ConfirmModal } from "../components/ConfirmModal";
import { NotifBell } from "../components/NotifBell";
import { TagInput } from "../components/TagInput";
import { TaskItem } from "../components/TaskItem";
import { EditToolbar, TaskSection } from "../components/TaskSection";
import { SidebarManager } from "../components/SidebarManager";
import { RightPanel } from "../components/RightPanel";
import { RescheduleModal } from "../components/RescheduleModal";

function AllTasksView({ tasks, handlers, editMode, selected, onSelect }) {
  const today = todayStr();
  const active = sortTasks(tasks.filter((t) => !t.done));
  const todayT    = active.filter((t) => t.due_date === today);
  const overdueT  = active.filter((t) => t.due_date && t.due_date < today);
  const thisWeekT = active.filter((t) => t.due_date && t.due_date > today && diffDays(t.due_date) <= 7);
  const noDueT    = active.filter((t) => !t.due_date);
  const futureT   = active.filter((t) => t.due_date && diffDays(t.due_date) > 7);
  const sectionProps = { editMode, selected, onSelect, handlers };
  return (
    <div>
      <TaskSection title="Overdue"     tasks={overdueT}  colorCls="group-overdue" {...sectionProps} />
      <TaskSection title="Today"       tasks={todayT}     colorCls="group-today"   {...sectionProps} />
      <TaskSection title="This week"   tasks={thisWeekT}  colorCls="group-week"    {...sectionProps} />
      <TaskSection title="Upcoming"    tasks={futureT}    colorCls="group-future"  {...sectionProps} />
      <TaskSection title="No due date" tasks={noDueT}     colorCls="group-none"    {...sectionProps} />
    </div>
  );
}

export function Dashboard({ username, theme, sidebarLayout, onLogout, onThemeToggle }) {
  const [tasks, setTasks]           = useState([]);
  const [tagInput, setTagInput]       = useState("");
  const [layout, setLayout]         = useState(sidebarLayout);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [showAdd, setShowAdd]       = useState(false);
  const [newTitle, setNewTitle]     = useState("");
  const [newCat, setNewCat]         = useState("work");
  const [newDue, setNewDue]         = useState("");
  const [newTags, setNewTags]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError]     = useState("");
  const [notifs, setNotifs]         = useState([]);
  const [rescheduleInfo, setRescheduleInfo] = useState(null);
  const [dragId, setDragId]         = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [showManage, setShowManage] = useState(false);
  const [editMode, setEditMode]     = useState(false);
  const [selected, setSelected]     = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    const res = await api("/tasks");
    if (res.status === 401) { localStorage.removeItem("token"); onLogout(); return; }
    if (res.ok) setTasks(res.data);
    setLoading(false);
  }, [onLogout]);

  async function loadNotifs() { const r = await api("/notifications"); if (r.ok) setNotifs(r.data); }

  useEffect(() => { load(); loadNotifs(); }, [load]);

  useEffect(() => {
    if (loading) return;
    const byDay = {};
    tasks.filter((t) => !t.done && t.due_date).forEach((t) => { byDay[t.due_date] = [...(byDay[t.due_date] || []), t]; });
    const over = Object.entries(byDay).find(([, arr]) => arr.length > 10);
    if (over) setRescheduleInfo({ date: over[0], tasks: over[1] });
  }, [tasks, loading]);

  useEffect(() => { setEditMode(false); setSelected([]); }, [filter]);

  async function saveLayout(next) {
    setLayout(next);
    await api("/me/sidebar", { method: "PATCH", body: JSON.stringify({ layout: next }) });
  }

  async function addTask(e) {
    e.preventDefault();
    if (!newTitle.trim()) { setAddError("Title is required."); return; }
    setAddLoading(true);
    const pendingTag = tagInput.trim().replace(/,/g, "");
    const finalTags = pendingTag && !newTags.includes(pendingTag) ? [...newTags, pendingTag] : newTags;
    const res = await api("/tasks", { method: "POST", body: JSON.stringify({ title: newTitle.trim(), category: newCat, due_date: newDue || null, tags: finalTags }) });
    setAddLoading(false);
    if (!res.ok) { setAddError(res.data.error); return; }
    setTasks((p) => [res.data, ...p]); setNewTitle(""); setNewDue(""); setNewTags([]); setTagInput(""); setShowAdd(false); setAddError("");
    toast.success("Task added");
  }

  async function toggleTask(id, done) {
    const res = await api(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ done: !done }) });
    if (res.ok) {
      setTasks((p) => p.map((t) => t.id === id ? res.data : t));
      if (!done) {
        toast.success("Task completed", () => {
          api(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ done: false }) }).then((r) => {
            if (r.ok) setTasks((p) => p.map((t) => t.id === id ? r.data : t));
          });
        });
      }
    }
    loadNotifs();
  }

  async function deleteTask(id) {
    const prev = tasks.find((t) => t.id === id);
    const res = await api(`/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((p) => p.filter((t) => t.id !== id));
      toast.success("Task deleted", async () => {
        const r = await api("/tasks", { method: "POST", body: JSON.stringify({ title: prev.title, category: prev.category, due_date: prev.due_date, tags: prev.tags }) });
        if (r.ok) setTasks((p) => [r.data, ...p]);
      });
    }
  }

  async function editTask(id, patch) {
    const res = await api(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    if (res.ok) { setTasks((p) => p.map((t) => t.id === id ? res.data : t)); loadNotifs(); }
    else toast.error(res.data.error || "Failed to save.");
  }

  function toggleSelect(id) { setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]); }
  function selectAll() { setSelected(visible.map((t) => t.id)); }
  function deselectAll() { setSelected([]); }

  async function completeSelected() {
    const toComplete = selected.filter((id) => { const t = tasks.find((t) => t.id === id); return t && !t.done; });
    if (toComplete.length === 0) return;
    await Promise.all(toComplete.map((id) => api(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ done: true }) })));
    setTasks((p) => p.map((t) => toComplete.includes(t.id) ? { ...t, done: true } : t));
    setSelected([]);
    toast.success(`${toComplete.length} tasks completed`, async () => {
      await Promise.all(toComplete.map((id) => api(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ done: false }) })));
      setTasks((p) => p.map((t) => toComplete.includes(t.id) ? { ...t, done: false } : t));
    });
    loadNotifs();
  }

  function promptDeleteSelected() { if (selected.length === 0) return; setConfirmDelete(true); }

  async function deleteSelected() {
    setConfirmDelete(false);
    const ids = [...selected];
    const prevTasks = ids.map((id) => tasks.find((t) => t.id === id)).filter(Boolean);
    await Promise.all(ids.map((id) => api(`/tasks/${id}`, { method: "DELETE" })));
    setTasks((p) => p.filter((t) => !ids.includes(t.id)));
    setSelected([]);
    toast.success(`${ids.length} tasks deleted`, async () => {
      const restored = await Promise.all(prevTasks.map((prev) =>
        api("/tasks", { method: "POST", body: JSON.stringify({ title: prev.title, category: prev.category, due_date: prev.due_date, tags: prev.tags }) })
      ));
      setTasks((p) => [...p, ...restored.filter((r) => r.ok).map((r) => r.data)]);
    });
  }

  async function handleDrop(targetId) {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const ids = sortTasks(tasks.filter((t) => !t.done)).map((t) => t.id);
    const from = ids.indexOf(dragId), to = ids.indexOf(targetId);
    if (from === -1 || to === -1) { setDragId(null); setDragOverId(null); return; }
    ids.splice(from, 1); ids.splice(to, 0, dragId);
    setTasks((p) => { const m = {}; ids.forEach((id, i) => { m[id] = i; }); return p.map((t) => m[t.id] !== undefined ? { ...t, sort_order: m[t.id] } : t); });
    await api("/tasks/reorder", { method: "POST", body: JSON.stringify({ order: ids }) });
    setDragId(null); setDragOverId(null);
  }

  const handlers = {
    onToggle: toggleTask, onDelete: deleteTask, onEdit: editTask,
    onDragStart: (id) => setDragId(id), onDragOver: (id) => setDragOverId(id), onDrop: handleDrop,
    dragOverId, dragId,
  };

  const today = todayStr();
  const total = tasks.length;
  const done  = tasks.filter((t) => t.done).length;
  const active = total - done;
  const initials = username.slice(0, 2).toUpperCase();
  const currentLabel = layout.find((f) => f.key === filter)?.label || filter;

  // Derive all unique tags from existing tasks
  const allTags = useMemo(() => {
    const tagSet = new Set();
    tasks.forEach(t => (t.tags || []).forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const tagColors = ["#7c5cff","#3b82f6","#10b981","#f59e0b","#f43f5e","#06b6d4"];

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => {
      const mf =
        filter === "all"       ? !t.done :
        filter === "today"     ? (!t.done && t.due_date === today) :
        filter === "completed" ? t.done :
        filter === "overdue"   ? (!t.done && t.due_date && t.due_date < today) :
        filter === "week"      ? (!t.done && t.due_date && t.due_date >= today && diffDays(t.due_date) <= 7) :
        filter === "urgent"    ? (!t.done && t.category === "urgent") :
        filter === "personal"  ? t.category === "personal" :
        filter === "work"      ? t.category === "work" :
        filter.startsWith("tag:") ? t.tags?.includes(filter.replace("tag:", "")) : t.category === filter || t.tags?.includes(filter);
      return mf && (!search || t.title.toLowerCase().includes(search.toLowerCase()));
    });
    return sortTasks(filtered);
  }, [tasks, filter, search, today]);

  const activeVisible    = visible.filter((t) => !t.done);
  const completedVisible = visible.filter((t) => t.done);

  return (
    <><div className="bg" />
      <Toast toasts={toast.toasts} remove={toast.remove} />
      {confirmDelete && (
        <ConfirmModal
          message={`Delete ${selected.length} task${selected.length > 1 ? "s" : ""}?`}
          detail="This will permanently delete the selected tasks. You can undo this action."
          onConfirm={deleteSelected}
          onCancel={() => setConfirmDelete(false)} />
      )}
      {rescheduleInfo && (
        <RescheduleModal date={rescheduleInfo.date} tasks={rescheduleInfo.tasks}
          onReschedule={(id, d) => editTask(id, { due_date: d })} onDismiss={() => setRescheduleInfo(null)} />
      )}

      <div className="app">
        <nav className="navbar">
          <span className="brand">Task<span>Flow</span></span>
          <div className="nav-user">
            <button className="theme-toggle" onClick={onThemeToggle} title="Toggle theme">{theme === "dark" ? "☀" : "☾"}</button>
            <NotifBell notifs={notifs} onDismiss={() => setNotifs([])} />
            <span style={{ fontSize: 13 }}>{username}</span>
            <div className="nav-avatar">{initials}</div>
            <button className="btn btn-sm" onClick={() => { localStorage.removeItem("token"); onLogout(); }}>Sign out</button>
          </div>
        </nav>

        <div className="main">
          <aside className="sidebar">
            <div className="dash-logo">TaskFlow</div>

            {/* Main nav items */}
            <div className="dash-nav-header">
              <span className="dash-nav-label">Categories</span>
              <button className="dash-manage-btn" onClick={() => setShowManage((o) => !o)}>{showManage ? "Done" : "Manage"}</button>
            </div>
            {showManage ? (
              <SidebarManager layout={layout} onChange={saveLayout} />
            ) : (
            <div className="dash-nav">
              {[
                { key: "all",       label: "All tasks",  icon: "▣" },
                { key: "today",     label: "Today",      icon: "☆" },
                { key: "personal",  label: "Personal",   icon: "◫" },
                { key: "work",      label: "Work",       icon: "📁" },
                { key: "urgent",    label: "Urgent",     icon: "⚡" },
                { key: "overdue",   label: "Overdue",    icon: "⏰" },
                { key: "completed", label: "Completed",  icon: "✓" },
              ].map((item) => (
                <button key={item.key} className={`dash-nav-item${filter === item.key ? " active" : ""}`} onClick={() => setFilter(item.key)}>
                  <span className="dash-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            )}

            {/* Tags section - derived from actual task tags */}
            <div className="dash-projects">
              <div className="dash-projects-label">Tags</div>
              {allTags.length === 0 && <div className="dash-no-tags">No tags yet</div>}
              {allTags.map((tag, i) => (
                <div key={tag} className={`dash-project-item${filter === "tag:" + tag ? " active" : ""}`} onClick={() => setFilter(filter === "tag:" + tag ? "all" : "tag:" + tag)}>
                  <span className="dash-project-dot" style={{ background: tagColors[i % tagColors.length] }} />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="content">
            <div className="stats">
              <div className="stat-card"><div className="stat-icon gray">☰</div><div className="stat-info"><div className="stat-label">Total</div><div className="stat-val">{total}</div></div></div>
              <div className="stat-card"><div className="stat-icon blue">◷</div><div className="stat-info"><div className="stat-label">Active</div><div className="stat-val blue">{active}</div></div></div>
              <div className="stat-card"><div className="stat-icon green">✓</div><div className="stat-info"><div className="stat-label">Done</div><div className="stat-val green">{done}</div></div></div>
            </div>

            <div className="filter-bar">
              <div className="search-bar" style={{ flex: 1 }}>
                <span className="search-icon">⌕</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" />
                {search && <button className="search-clear" onClick={() => setSearch("")}>×</button>}
              </div>
              <button className={`btn btn-sm${editMode ? " btn-edit-active" : ""}`}
                onClick={() => { setEditMode((o) => !o); setSelected([]); }} title="Edit mode">
                {editMode ? "Exit edit" : "Edit mode"}
              </button>
            </div>

            {editMode && (
              <EditToolbar tasks={visible} selected={selected}
                onSelectAll={selectAll} onDeselectAll={deselectAll}
                onCompleteSelected={completeSelected} onDeleteSelected={promptDeleteSelected} />
            )}

            <div className="content-header">
              <h2>{currentLabel}</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAdd((s) => !s)}>{showAdd ? "Cancel" : "+ Add task"}</button>
            </div>

            {showAdd && (
              <form className="add-form" onSubmit={addTask}>
                <h3>New task</h3>
                {addError && <div className="error">{addError}</div>}
                <div className="form-row">
                  <div className="field" style={{ flex: 2 }}><label>Title</label>
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What needs to be done?" autoFocus />
                  </div>
                  <div className="field"><label>Category</label>
                    <select value={newCat} onChange={(e) => setNewCat(e.target.value)}>
                      <option value="work">Work</option><option value="personal">Personal</option>
                      <option value="urgent">Urgent</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div className="field"><label>Due date</label>
                    <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>Tags</label>
                  <div className="tag-picker-wrap">
                    {allTags.length > 0 && (
                      <div className="tag-picker-options">
                        {allTags.map((tag, i) => (
                          <button key={tag} type="button"
                            className={"tag-picker-opt" + (newTags.includes(tag) ? " selected" : "")}
                            style={{ borderColor: tagColors[i % tagColors.length], color: newTags.includes(tag) ? "#fff" : tagColors[i % tagColors.length], background: newTags.includes(tag) ? tagColors[i % tagColors.length] + "44" : "transparent" }}
                            onClick={() => setNewTags(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag])}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <TagInput tags={newTags} onChange={setNewTags} inputValue={tagInput} onInputChange={setTagInput} />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={addLoading}>
                  {addLoading ? <span className="spinner spinner-sm" /> : "Add task"}
                </button>
              </form>
            )}

            {loading ? (
              <div className="empty-state"><div className="loading-ring" /><h3>Loading your tasks…</h3></div>
            ) : filter === "all" ? (
              visible.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div><h3>No active tasks</h3>
                  <p>All caught up! Add a task to get started.</p>
                  <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add a task</button>
                </div>
              ) : (
                <AllTasksView
                  tasks={tasks.filter((t) => !t.done && (!search || t.title.toLowerCase().includes(search.toLowerCase())))}
                  handlers={handlers} editMode={editMode} selected={selected} onSelect={toggleSelect} />
              )
            ) : filter === "completed" ? (
              visible.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">✓</div><h3>No completed tasks</h3><p>Tasks you complete will appear here.</p></div>
              ) : (
                <div className="task-list">
                  {visible.map((t) => (
                    <TaskItem key={t.id} task={t} {...handlers}
                      editMode={editMode} selected={selected.includes(t.id)} onSelect={toggleSelect}
                      isDragging={dragOverId === t.id && dragId !== t.id} />
                  ))}
                </div>
              )
            ) : visible.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div><h3>No tasks here</h3>
                <p>{search ? "Try adjusting your search." : "Nothing in this category yet."}</p>
                {!search && <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add a task</button>}
              </div>
            ) : (
              <div className="task-list">
                {activeVisible.length > 0 && (
                  <div className="task-group">
                    <div className="group-header group-active">
                      <span className="group-label">Active</span>
                      <span className="group-count">{activeVisible.length}</span>
                    </div>
                    {activeVisible.map((t) => (
                      <TaskItem key={t.id} task={t} {...handlers}
                        editMode={editMode} selected={selected.includes(t.id)} onSelect={toggleSelect}
                        isDragging={dragOverId === t.id && dragId !== t.id} />
                    ))}
                  </div>
                )}
                {completedVisible.length > 0 && (
                  <div className="task-group">
                    <div className="group-header group-completed">
                      <span className="group-label">Completed ({completedVisible.length})</span>
                      <span className="group-count">{completedVisible.length}</span>
                    </div>
                    {completedVisible.map((t) => (
                      <TaskItem key={t.id} task={t} {...handlers}
                        editMode={editMode} selected={selected.includes(t.id)} onSelect={toggleSelect}
                        isDragging={dragOverId === t.id && dragId !== t.id} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <RightPanel tasks={tasks} onFilterClick={(key) => { setFilter(key); setEditMode(false); setSelected([]); }} />
        </div>
      </div>
    </>
  );
}
