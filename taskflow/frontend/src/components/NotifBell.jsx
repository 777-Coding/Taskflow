import { useState, useEffect, useRef } from "react";

export function NotifBell({ notifs, onDismiss }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="notif-wrap" ref={ref}>
      <button className={`notif-btn${notifs.length > 0 ? " has-notifs" : ""}`} onClick={() => setOpen((o) => !o)}>
        🔔{notifs.length > 0 && <span className="notif-count">{notifs.length}</span>}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">Reminders</div>
          {notifs.length === 0 ? (
            <div className="notif-empty">No upcoming reminders</div>
          ) : (
            notifs.map((n) => (
              <div key={n.id} className={`notif-item notif-${n.type}`}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-sub">
                  {n.type === "overdue" ? "Overdue" : n.type === "today" ? "Due today" : "Due tomorrow"}
                </div>
              </div>
            ))
          )}
          {notifs.length > 0 && <button className="notif-dismiss" onClick={onDismiss}>Dismiss all</button>}
        </div>
      )}
    </div>
  );
}
