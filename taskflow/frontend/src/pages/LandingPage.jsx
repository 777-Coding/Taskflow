import { useEffect } from "react";

const mockTasks = [
  { title: "Finish landing page design", cat: "Work", catColor: "#6366f1", time: "10:00 AM" },
  { title: "Reply to client email", cat: "Work", catColor: "#6366f1", time: "11:30 AM" },
  { title: "Grocery shopping", cat: "Personal", catColor: "#10b981", time: "2:00 PM" },
  { title: "Read 20 pages", cat: "Study", catColor: "#f59e0b", time: "4:00 PM" },
  { title: "Workout", cat: "Health", catColor: "#22c55e", time: "6:00 PM" },
];

const mockUpcoming = [
  { title: "Team meeting", cat: "Work", catColor: "#6366f1", time: "Tomorrow" },
  { title: "Project proposal", cat: "Work", catColor: "#6366f1", time: "Wed, 12" },
  { title: "Dentist appointment", cat: "Personal", catColor: "#10b981", time: "Fri, 14" },
];

const sidebarItems = [
  { label: "Inbox", icon: "☰" },
  { label: "Today", icon: "☆", count: 6, active: true },
  { label: "Upcoming", icon: "📅" },
  { label: "Projects", icon: "📁" },
  { label: "Calendar", icon: "📆" },
  { label: "Tags", icon: "🏷" },
];

const projects = [
  { name: "Work", color: "#6366f1" },
  { name: "Personal", color: "#3b82f6" },
  { name: "Study", color: "#22c55e" },
  { name: "Health", color: "#f59e0b" },
];

const features = [
  { icon: "✓", title: "Smart Task Management", desc: "Organize tasks with categories, tags, and due dates. Everything in one place." },
  { icon: "📅", title: "Due Date Tracking", desc: "Never miss a deadline. Get visual indicators for overdue, today, and upcoming tasks at a glance." },
  { icon: "🔔", title: "Reminders & Notifications", desc: "Never miss what matters. Built-in reminders keep you on track, every step of the way." },
  { icon: "🌙", title: "Dark & Light Themes", desc: "Switch between dark and light modes anytime. Comfortable for any time of day." },
  { icon: "✏", title: "Bulk Edit Mode", desc: "Select multiple tasks to complete or delete them all at once. Work faster, not harder." },
  { icon: "✦", title: "AI Assistant", desc: "Get smart suggestions, task summaries, and help sorting your priorities effortlessly." },
];

export function LandingPage({ onGetStarted }) {
  useEffect(() => {
    const els = document.querySelectorAll(".lp3-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lp3-visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp3">
      <div className="lp3-bg" />

      {/* Navbar */}
      <nav className="lp3-nav">
        <span className="lp3-logo">TaskFlow</span>
        <div className="lp3-nav-links">
          <a href="#features">Features</a>
          <a href="#features">Solutions</a>
          <a href="#features">About</a>
        </div>
        <button className="lp3-nav-btn" onClick={onGetStarted}>Sign in</button>
      </nav>

      {/* Hero */}
      <section className="lp3-hero">
        {/* Left side */}
        <div className="lp3-left">
          <div className="lp3-badge">✦ TASK MANAGEMENT. SIMPLIFIED.</div>
          <h1 className="lp3-title">
            Get things<br />done. Stay<br />in flow.
          </h1>
          <p className="lp3-desc">
            TaskFlow helps you organize your work and personal tasks<br />
            in one clean, distraction-free space. No clutter, no complexity.
          </p>
          <div className="lp3-btns">
            <button className="lp3-cta" onClick={onGetStarted}>Get started — it's free →</button>
            <button className="lp3-ghost" onClick={onGetStarted}>Learn more →</button>
          </div>
        </div>

        {/* Right side — App mockup */}
        <div className="lp3-right">
          <div className="lp3-mockup">
            {/* Mockup top bar */}
            <div className="lp3-mock-topbar">
              <div className="lp3-mock-icons-left">
                <span className="lp3-mock-brand">TaskFlow</span>
              </div>
              <div className="lp3-mock-search">
                <span className="lp3-mock-search-icon">⌕</span>
                <span className="lp3-mock-search-text">Search tasks...</span>
              </div>
              <div className="lp3-mock-icons-right">
                <span className="lp3-mock-bell">🔔</span>
                <div className="lp3-mock-avatar">AR</div>
              </div>
            </div>

            {/* Mockup body */}
            <div className="lp3-mock-body">
              {/* Sidebar */}
              <div className="lp3-mock-sidebar">
                {sidebarItems.map((item) => (
                  <div key={item.label} className={`lp3-mock-sitem${item.active ? " lp3-mock-sactive" : ""}`}>
                    <span className="lp3-mock-sicon">{item.icon}</span>
                    <span className="lp3-mock-slabel">{item.label}</span>
                    {item.count && <span className="lp3-mock-scount">{item.count}</span>}
                  </div>
                ))}
                <div className="lp3-mock-ssection">Projects</div>
                {projects.map((p) => (
                  <div key={p.name} className="lp3-mock-pitem">
                    <span className="lp3-mock-pdot" style={{ background: p.color }} />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>

              {/* Task list */}
              <div className="lp3-mock-tasks">
                <div className="lp3-mock-viewcal">📅 View calendar</div>
                <div className="lp3-mock-section">Today</div>
                {mockTasks.map((t, i) => (
                  <div key={i} className="lp3-mock-task">
                    <div className="lp3-mock-checkbox" />
                    <span className="lp3-mock-ttitle">{t.title}</span>
                    <span className="lp3-mock-tcat" style={{ background: t.catColor + "33", color: t.catColor }}>{t.cat}</span>
                    <span className="lp3-mock-ttime">{t.time}</span>
                  </div>
                ))}
                <div className="lp3-mock-section lp3-mock-section-mt">Upcoming</div>
                {mockUpcoming.map((t, i) => (
                  <div key={i} className="lp3-mock-task">
                    <div className="lp3-mock-checkbox" />
                    <span className="lp3-mock-ttitle">{t.title}</span>
                    <span className="lp3-mock-tcat" style={{ background: t.catColor + "33", color: t.catColor }}>{t.cat}</span>
                    <span className="lp3-mock-ttime">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp3-features" id="features">
        <div className="lp3-fgrid">
          {features.map((f, i) => (
            <div key={i} className="lp3-reveal lp3-feat">
              <div className="lp3-ficon">{f.icon}</div>
              <div className="lp3-ftitle">{f.title}</div>
              <div className="lp3-fdesc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="lp3-footer">
        <span className="lp3-logo" style={{ fontSize: 16 }}>TaskFlow</span>
        <span className="lp3-footer-copy">© 2026 TaskFlow. Built for people who get things done.</span>
        <button className="lp3-nav-btn" onClick={onGetStarted}>Get started</button>
      </footer>
    </div>
  );
}
