import { useState } from "react";

export function RescheduleModal({ date, tasks, onReschedule, onDismiss }) {
  const [sel, setSel] = useState({});
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1); return d.toISOString().slice(0, 10);
  });

  function apply() {
    Object.entries(sel).forEach(([id, nd]) => { if (nd) onReschedule(Number(id), nd); });
    onDismiss();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-icon">⚠</div>
          <div>
            <h3>Too many tasks on {new Date(date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</h3>
            <p>You have {tasks.length} tasks due this day. Consider rescheduling some.</p>
          </div>
        </div>
        <div className="modal-tasks">
          {tasks.map((t) => (
            <div key={t.id} className="modal-task-row">
              <span className="modal-task-title">{t.title}</span>
              <select value={sel[t.id] || ""} onChange={(e) => setSel((s) => ({ ...s, [t.id]: e.target.value }))}>
                <option value="">Keep</option>
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {new Date(d + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={onDismiss}>Dismiss</button>
          <button className="btn btn-primary" onClick={apply}>Apply changes</button>
        </div>
      </div>
    </div>
  );
}
