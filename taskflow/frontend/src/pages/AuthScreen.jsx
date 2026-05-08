import { useState } from "react";
import { api } from "../services/api";

const perks = [
  { icon: "✓", text: "Free forever — no credit card needed" },
  { icon: "🔒", text: "bcrypt password hashing — your password is never stored in plain text" },
  { icon: "⚡", text: "JWT-secured sessions with automatic expiry" },
  { icon: "📋", text: "Unlimited tasks, categories, and tags" },
  { icon: "🌙", text: "Dark & light theme, saved to your account" },
  { icon: "📱", text: "Works on desktop and mobile" },
];

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
    <div className="tf-auth">
      <div className="tf-auth-bg" />

      {/* Left panel */}
      <div className="tf-auth-left">
        <div className="tf-auth-logo">TaskFlow</div>
        <div className="tf-auth-pitch">
          <div className="tf-badge" style={{ marginBottom: 24 }}>
            <span className="tf-sparkle">✦</span> TASK MANAGEMENT. SIMPLIFIED.
          </div>
          <h2 className="tf-auth-headline">
            {mode === "login" ? "Welcome back." : "Get organised today."}
          </h2>
          <p className="tf-auth-sub">
            {mode === "login"
              ? "Sign in to pick up right where you left off. Your tasks are waiting."
              : "Create your free account and start managing your tasks in minutes."}
          </p>
          <div className="tf-auth-perks">
            {perks.map((p, i) => (
              <div key={i} className="tf-auth-perk">
                <span className="tf-auth-perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="tf-auth-right">
        <form className="tf-auth-form" onSubmit={submit}>
          <div className="tf-auth-form-logo">TaskFlow</div>
          <h3>{mode === "login" ? "Sign in" : "Create account"}</h3>
          <p className="tf-auth-form-sub">{mode === "login" ? "Enter your details to continue" : "Fill in the details below to get started"}</p>

          {error && <div className="tf-auth-error">{error}</div>}

          <div className="tf-auth-field">
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="your username" autoFocus />
          </div>
          <div className="tf-auth-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {mode === "register" && (
            <div className="tf-auth-field">
              <label>Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
            </div>
          )}

          <button className="tf-auth-submit" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : mode === "login" ? "Sign in →" : "Create account →"}
          </button>

          <p className="tf-auth-switch">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
