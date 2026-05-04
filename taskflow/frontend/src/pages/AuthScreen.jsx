import { useState } from "react";
import { api } from "../services/api";

export function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError("");
    if (mode === "register" && password !== confirm) { setError("Passwords do not match."); return; }
    if (mode === "register" && password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const res = await api(`/${mode}`, { method: "POST", body: JSON.stringify({ username, password }) });
    setLoading(false);
    if (!res.ok) { setError(res.data.error || "Something went wrong."); return; }
    localStorage.setItem("token", res.data.token);
    onLogin(res.data.username, res.data.theme || "dark", res.data.sidebar_layout);
  }

  return (
    <><div className="bg" />
      <div className="auth-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-logo">Task<span>Flow</span></div>
          <div className="auth-card-header">
            <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p>{mode === "login" ? "Sign in to continue" : "Get started for free"}</p>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="field"><label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your username" autoFocus />
          </div>
          <div className="field"><label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {mode === "register" && (
            <div className="field"><label>Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
            </div>
          )}
          <button className="btn btn-primary full" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : mode === "login" ? "Sign in" : "Create account"}
          </button>
          <p className="auth-switch">
            {mode === "login" ? "No account? " : "Already have one? "}
            <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
