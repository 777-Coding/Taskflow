export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function diffDays(str) {
  if (!str) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const [y, m, d] = str.split("-").map(Number);
  return Math.round((new Date(y, m - 1, d) - now) / 86400000);
}

export function fmtDue(str) {
  if (!str) return null;
  const diff = diffDays(str);
  if (diff < 0)   return { label: `${Math.abs(diff)}d overdue`, cls: "due-overdue" };
  if (diff === 0) return { label: "Today",    cls: "due-today" };
  if (diff === 1) return { label: "Tomorrow", cls: "due-soon" };
  if (diff <= 7)  return { label: `In ${diff}d`, cls: "due-week" };
  const [y, m, d] = str.split("-").map(Number);
  return { label: new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), cls: "due-future" };
}

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return -1;
    if (!b.due_date) return 1;
    return a.due_date.localeCompare(b.due_date);
  });
}
