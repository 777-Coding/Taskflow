const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function api(path, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
    .then(async (r) => {
      const d = await r.json();
      return { ok: r.ok, status: r.status, data: d };
    })
    .catch(() => ({ ok: false, status: 0, data: { error: "Cannot connect to server." } }));
}
