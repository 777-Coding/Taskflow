import { useState } from "react";
import { todayStr, diffDays } from "../utils/dateHelpers";

function Section({ label, count, items, filterKey, accent, onFilterClick }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rp-section">
      <div className="rp-section-header" onClick={() => setOpen((o) => !o)}>
        <span className={`rp-label ${accent}`}>{label}</span>
        <span className={`rp-count ${accent}`}>{count}</span>
      </div>
      {open && (
        <div className="rp-tasks">
          {items.length === 0 ? (
            <div className="rp-empty">None</div>
          ) : (
            items.slice(0, 5).map((t) => (
              <div key={t.id} className="mini-task">
                <div className="mini-dot" /><div className="mini-title">{t.title}</div>
              </div>
            ))
          )}
          {items.length > 5 && (
            <button className="rp-more" onClick={() => onFilterClick(filterKey)}>+{items.length - 5} more</button>
          )}
        </div>
      )}
    </div>
  );
}

export function RightPanel({ tasks, onFilterClick }) {
  const today = todayStr();
  const todayT    = tasks.filter((t) => !t.done && t.due_date === today);
  const overdueT  = tasks.filter((t) => !t.done && t.due_date && t.due_date < today);
  const upcomingT = tasks.filter((t) => !t.done && t.due_date && t.due_date > today && diffDays(t.due_date) <= 7);
  return (
    <aside className="right-panel">
      <div className="rp-title">Quick view</div>
      <Section label="Today"     count={todayT.length}    items={todayT}    filterKey="today"   accent="accent-today"   onFilterClick={onFilterClick} />
      <Section label="Overdue"   count={overdueT.length}  items={overdueT}  filterKey="overdue" accent="accent-overdue" onFilterClick={onFilterClick} />
      <Section label="This week" count={upcomingT.length} items={upcomingT} filterKey="week"    accent="accent-week"    onFilterClick={onFilterClick} />
    </aside>
  );
}
