import { useState, useEffect } from "react";
import { fmtDue } from "../utils/dateHelpers";
import { TagInput } from "./TagInput";

export function TaskItem({ task, onToggle, onDelete, onEdit, onDragStart, onDragOver, onDrop, isDragging, editMode, selected, onSelect }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.due_date || "");
  const [category, setCategory] = useState(task.category);
  const [tags, setTags] = useState(task.tags || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDueDate(task.due_date || "");
    setCategory(task.category);
    setTags(task.tags || []);
  }, [task]);

  async function save() {
    if (!title.trim()) return;
    setSaving(true);
    await onEdit(task.id, { title: title.trim(), due_date: dueDate || null, category, tags });
    setSaving(false);
    setEditing(false);
  }

  const badges = { work: "badge-work", personal: "badge-personal", urgent: "badge-urgent", other: "badge-other" };
  const due = fmtDue(task.due_date);

  return (
    <div
      className={`task-item${task.done ? " done" : ""}${task.category === "urgent" ? " urgent" : ""}${isDragging ? " dragging" : ""}${editMode && selected ? " selected" : ""}`}
      draggable={!editMode}
      onDragStart={!editMode ? () => onDragStart(task.id) : undefined}
      onDragOver={!editMode ? (e) => { e.preventDefault(); onDragOver(task.id); } : undefined}
      onDrop={!editMode ? () => onDrop(task.id) : undefined}
    >
      {editMode ? (
        <input type="checkbox" className="task-select-cb" checked={selected} onChange={() => onSelect(task.id)} />
      ) : (
        <div className="drag-handle">⠿</div>
      )}
      <button className={`task-check${task.done ? " checked" : ""}`} onClick={() => onToggle(task.id, task.done)} />
      <div className="task-body">
        {editing ? (
          <div className="edit-fields">
            <input
              className="edit-input" value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
              autoFocus
            />
            <div className="edit-row">
              <select className="edit-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="urgent">Urgent</option>
                <option value="other">Other</option>
              </select>
              <input className="edit-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <TagInput tags={tags} onChange={setTags} />
          </div>
        ) : (
          <>
            <div className="task-title">{task.title}</div>
            {task.tags?.length > 0 && (
              <div className="task-tags">{task.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
            )}
          </>
        )}
        <div className="task-meta">
          <span className={`badge ${badges[task.category] || "badge-other"}`}>{task.category}</span>
          {due && !editing && <span className={`due-badge ${due.cls}`}>{due.label}</span>}
          {!task.due_date && !editing && <span className="due-badge due-none">No date</span>}
          {task.done && task.done_at && !editing && (
            <span className="done-at">Completed {new Date(task.done_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          )}
        </div>
      </div>
      {!editMode && (
        <div className="task-actions">
          {editing ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
                {saving ? <span className="spinner spinner-sm" /> : "Save"}
              </button>
              <button className="btn btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              {!task.done
                ? <button className="btn btn-sm btn-complete" onClick={() => onToggle(task.id, task.done)}>Complete</button>
                : <button className="btn btn-sm btn-undo-task" onClick={() => onToggle(task.id, task.done)}>Undo</button>}
              <button className="btn btn-sm" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
