import { useEffect } from "react";

const tasks = [
  { title: "Finish landing page design", tag: "Work", tagClass: "tf-tag-work", time: "10:00 AM" },
  { title: "Reply to client email",      tag: "Work", tagClass: "tf-tag-work", time: "11:30 AM" },
  { title: "Grocery shopping",           tag: "Personal", tagClass: "tf-tag-personal", time: "2:00 PM" },
  { title: "Read 20 pages",              tag: "Study", tagClass: "tf-tag-study", time: "4:00 PM" },
  { title: "Workout",                    tag: "Health", tagClass: "tf-tag-health", time: "6:00 PM" },
];

const upcoming = [
  { title: "Team meeting",       tag: "Work",     tagClass: "tf-tag-work",     time: "Tomorrow" },
  { title: "Project proposal",   tag: "Work",     tagClass: "tf-tag-work",     time: "Wed, 12" },
  { title: "Dentist appointment",tag: "Personal", tagClass: "tf-tag-personal", time: "Fri, 14" },
];

const features = [
  { icon: "☑", title: "Smart Task Management",    desc: "Organize tasks with categories, tags, and due dates. Everything in one place." },
  { icon: "🗓", title: "Due Date Tracking",        desc: "Never miss a deadline. Get visual indicators for overdue, today, and upcoming tasks." },
  { icon: "🔔", title: "Reminders & Notifications",desc: "Never miss what matters. Built-in reminders keep you on track every step of the way." },
  { icon: "☾", title: "Dark & Light Themes",      desc: "Switch between dark and light modes anytime. Comfortable for any time of day." },
  { icon: "⚙", title: "Bulk Edit Mode",           desc: "Select multiple tasks to complete or delete them all at once. Work faster, not harder." },
  { icon: "✦", title: "AI Assistant",             desc: "Get smart suggestions, task summaries, and help sorting your priorities effortlessly." },
];

export function LandingPage({ onGetStarted }) {
  useEffect(() => {
    const tasks = document.querySelectorAll(".tf-task");
    tasks.forEach(t => {
      t.addEventListener("mouseenter", () => { t.style.transform = "translateY(-2px)"; t.style.background = "rgba(255,255,255,0.05)"; });
      t.addEventListener("mouseleave", () => { t.style.transform = "translateY(0)"; t.style.background = "rgba(255,255,255,0.03)"; });
    });
  }, []);

  return (
    <div className="tf-landing">
      <div className="tf-container">

        {/* Navbar */}
        <nav className="tf-navbar">
          <div className="tf-logo">TaskFlow</div>
          <ul className="tf-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#features">Solutions</a></li>
            <li><a href="#features">About</a></li>
          </ul>
          <button className="tf-signin-btn" onClick={onGetStarted}>Sign in</button>
        </nav>

        {/* Hero */}
        <section className="tf-hero">
          <div className="tf-hero-left">
            <div className="tf-badge">
              <span className="tf-sparkle">✦</span>
              TASK MANAGEMENT. SIMPLIFIED.
            </div>
            <h1>Get things<br />done. Stay<br />in flow.</h1>
            <p>TaskFlow helps you organize your work and personal tasks in one clean, distraction-free space. No clutter, no complexity.</p>
            <div className="tf-actions">
              <button className="tf-primary-btn" onClick={onGetStarted}>Get started — it's free →</button>
              <button className="tf-secondary-btn" onClick={onGetStarted}>Learn more →</button>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="tf-dashboard">
            <div className="tf-dash-top">
              <div className="tf-dash-brand">TaskFlow</div>
              <div className="tf-search">🔍 Search tasks...</div>
            </div>
            <div className="tf-dash-content">
              <aside className="tf-sidebar">
                <div className="tf-menu-item tf-menu-active">▣ Inbox</div>
                <div className="tf-menu-item">☆ Today</div>
                <div className="tf-menu-item">🗓 Upcoming</div>
                <div className="tf-menu-item">📁 Projects</div>
                <div className="tf-menu-item">🗓 Calendar</div>
                <div className="tf-menu-item">🏷 Tags</div>
                <div className="tf-projects">
                  <h4>Projects</h4>
                  <div className="tf-project"><span className="tf-dot tf-dot-purple" />Work</div>
                  <div className="tf-project"><span className="tf-dot tf-dot-blue" />Personal</div>
                  <div className="tf-project"><span className="tf-dot tf-dot-green" />Study</div>
                  <div className="tf-project"><span className="tf-dot tf-dot-orange" />Health</div>
                </div>
              </aside>
              <main className="tf-tasks">
                <h2 className="tf-section-title">Today</h2>
                {tasks.map((t, i) => (
                  <div key={i} className="tf-task" style={{ transition: "0.25s ease" }}>
                    <div className="tf-task-left"><div className="tf-checkbox" /><span>{t.title}</span></div>
                    <div className="tf-task-left"><span className={`tf-tag ${t.tagClass}`}>{t.tag}</span><span className="tf-time">{t.time}</span></div>
                  </div>
                ))}
                <div className="tf-upcoming">
                  <h2 className="tf-section-title">Upcoming</h2>
                  {upcoming.map((t, i) => (
                    <div key={i} className="tf-task" style={{ transition: "0.25s ease" }}>
                      <div className="tf-task-left"><div className="tf-checkbox" /><span>{t.title}</span></div>
                      <div className="tf-task-left"><span className={`tf-tag ${t.tagClass}`}>{t.tag}</span><span className="tf-time">{t.time}</span></div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="tf-features" id="features">
          {features.map((f, i) => (
            <div key={i} className="tf-feature">
              <div className="tf-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
