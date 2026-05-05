import { useState, useEffect } from "react";
import "./App.css";
import { api } from "./services/api";
import { AuthScreen } from "./pages/AuthScreen";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";

export default function App() {
  const [username, setUsername] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [sidebarLayout, setSidebar] = useState(null);
  const [checking, setChecking] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setChecking(false); return; }
    api("/me").then((res) => {
      if (res.ok) {
        setUsername(res.data.username);
        setTheme(res.data.theme || "dark");
        setSidebar(res.data.sidebar_layout);
      } else {
        localStorage.removeItem("token");
      }
      setChecking(false);
    }).catch(() => { localStorage.removeItem("token"); setChecking(false); });
  }, []);

  async function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    await api("/me/theme", { method: "PATCH", body: JSON.stringify({ theme: next }) });
  }

  if (checking) return (
    <><div className="bg" /><div style={{ padding: 80, textAlign: "center", color: "#fff", position: "relative" }}>Loading...</div></>
  );

  if (username) return (
    <Dashboard
      username={username}
      theme={theme}
      sidebarLayout={sidebarLayout}
      onLogout={() => { setUsername(null); setTheme("dark"); setSidebar(null); setShowAuth(false); }}
      onThemeToggle={toggleTheme}
    />
  );

  if (showAuth) return (
    <AuthScreen onLogin={(u, t, sl) => { setUsername(u); setTheme(t || "dark"); setSidebar(sl); }} />
  );

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}
