import { useState, useRef } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  function add(msg, type = "info", onUndo = null) {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type, onUndo }]);
    timers.current[id] = setTimeout(() => remove(id), onUndo ? 6000 : 3500);
    return id;
  }

  function remove(id) {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((p) => p.filter((t) => t.id !== id));
  }

  return {
    toasts,
    remove,
    success: (m, onUndo) => add(m, "success", onUndo),
    error: (m) => add(m, "error"),
    warn: (m) => add(m, "warn"),
  };
}
