import { useState } from "react";
import { TaskItem } from "./TaskItem";

export function EditToolbar({ tasks, selected, onSelectAll, onDeselectAll, onCompleteSelected, onDeleteSelected }) {
  const allSelected = tasks.length > 0 && selected.length === tasks.length;
  return (
    <div className="edit-toolbar">
      <div className="edit-toolbar-left">
        <input type="checkbox" checked={allSelected} onChange={allSelected ? onDeselectAll : onSelectAll} className="toolbar-cb" />
        <span className="toolbar-count">{selected.length} selected</span>
      </div>
      <div className="edit-toolbar-right">
        <button className="btn btn-sm btn-complete" disabled={selected.length === 0} onClick={onCompleteSelected}>Mark complete</button>
        <button className="btn btn-sm btn-danger" disabled={selected.length === 0} onClick={onDeleteSelected}>Delete selected</button>
      </div>
    </div>
  );
}

export function TaskSection({ title, tasks, colorCls, editMode, selected, onSelect, handlers }) {
  const [open, setOpen] = useState(true);
  if (tasks.length === 0) return null;
  return (
    <div className="task-group">
      <div className={`group-header ${colorCls}`} onClick={() => setOpen((o) => !o)} style={{ cursor: "pointer" }}>
        <div>
          <span className="group-label">{title}</span>
          <span className="group-toggle">{open ? "▾" : "▸"}</span>
        </div>
        <span className="group-count">{tasks.length}</span>
      </div>
      {open && tasks.map((t) => (
        <TaskItem key={t.id} task={t} {...handlers}
          editMode={editMode} selected={selected.includes(t.id)} onSelect={onSelect}
          isDragging={handlers.dragOverId === t.id && handlers.dragId !== t.id} />
      ))}
    </div>
  );
}
