import { useState } from "react";

const MAX_CUSTOM_CATS = 3;

export function SidebarManager({ layout, onChange }) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const customCount = layout.filter((i) => !i.builtin).length;

  function addCategory() {
    const label = newLabel.trim();
    if (!label || customCount >= MAX_CUSTOM_CATS) return;
    const key = "custom_" + label.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    onChange([...layout, { key, label, builtin: false }]);
    setNewLabel(""); setAdding(false);
  }

  function handleDrop(idx) {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const next = [...layout];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    onChange(next);
    setDragIdx(null); setDragOverIdx(null);
  }

  return (
    <div className="sidebar-manager">
      {layout.map((item, idx) => (
        <div key={item.key}
          className={`sidebar-item-wrap${dragOverIdx === idx && dragIdx !== idx ? " drag-over" : ""}`}
          draggable onDragStart={() => setDragIdx(idx)}
          onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
          onDrop={() => handleDrop(idx)}
        >
          <span className="sidebar-drag-handle">⠿</span>
          <span className="sidebar-item-label">{item.label}</span>
          {!item.builtin && (
            <button className="sidebar-delete-btn" onClick={() => onChange(layout.filter((i) => i.key !== item.key))}>×</button>
          )}
        </div>
      ))}
      {customCount < MAX_CUSTOM_CATS ? (
        adding ? (
          <div className="sidebar-add-form">
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") setAdding(false); }}
              placeholder="Category name…" autoFocus />
            <button className="btn btn-primary btn-sm" onClick={addCategory}>Add</button>
            <button className="btn btn-sm" onClick={() => setAdding(false)}>×</button>
          </div>
        ) : (
          <button className="sidebar-add-btn" onClick={() => setAdding(true)}>+ Add category</button>
        )
      ) : (
        <div className="sidebar-max">Max {MAX_CUSTOM_CATS} custom categories reached</div>
      )}
    </div>
  );
}
