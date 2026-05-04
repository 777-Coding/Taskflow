export function Toast({ toasts, remove }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{t.type === "error" ? "✕" : t.type === "warn" ? "⚠" : "✓"}</span>
          <span className="toast-msg">{t.msg}</span>
          {t.onUndo && (
            <button className="toast-undo" onClick={() => { t.onUndo(); remove(t.id); }}>Undo</button>
          )}
          <button className="toast-close" onClick={() => remove(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
