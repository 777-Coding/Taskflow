import { useEffect } from "react";
import { TopNav } from "../components/TopNav";

const tasks = [
  { title: "Finish landing page design", tag: "Work",     tagClass: "tf-tag-work",     time: "10:00 AM" },
  { title: "Reply to client email",      tag: "Work",     tagClass: "tf-tag-work",     time: "11:30 AM" },
  { title: "Grocery shopping",           tag: "Personal", tagClass: "tf-tag-personal", time: "2:00 PM"  },
  { title: "Read 20 pages",              tag: "Study",    tagClass: "tf-tag-study",    time: "4:00 PM"  },
  { title: "Workout",                    tag: "Health",   tagClass: "tf-tag-health",   time: "6:00 PM"  },
];

const upcoming = [
  { title: "Team meeting",        tag: "Work",     tagClass: "tf-tag-work",     time: "Tomorrow" },
  { title: "Project proposal",    tag: "Work",     tagClass: "tf-tag-work",     time: "Wed, 12"  },
  { title: "Dentist appointment", tag: "Personal", tagClass: "tf-tag-personal", time: "Fri, 14"  },
];

const features = [
  { icon: "☑",  title: "Smart Task Management",     desc: "Organize tasks with categories, tags, and due dates. Everything in one place." },
  { icon: "🗓", title: "Due Date Tracking",          desc: "Never miss a deadline. Get visual indicators for overdue, today, and upcoming tasks." },
  { icon: "🔔", title: "Reminders & Notifications", desc: "Never miss what matters. Built-in reminders keep you on track every step of the way." },
  { icon: "☾",  title: "Dark & Light Themes",       desc: "Switch between dark and light modes anytime. Comfortable for any time of day." },
  { icon: "⚙",  title: "Bulk Edit Mode",            desc: "Select multiple tasks to complete or delete them all at once. Work faster, not harder." },
  { icon: "✦",  title: "AI Assistant",              desc: "Get smart suggestions, task summaries, and help sorting your priorities effortlessly." },
];

const detailedFeatures = [
  {
    icon: "📋",
    title: "Full Task Control",
    points: [
      "Create tasks with titles, categories, tags, and due dates",
      "Drag and drop to reorder tasks by priority",
      "Bulk select to complete or delete multiple tasks at once",
      "Inline editing — update any task without leaving the page",
      "Mark tasks complete with a single click, undo instantly",
    ],
  },
  {
    icon: "📅",
    title: "Smart Scheduling",
    points: [
      "Due date picker with overdue, today, and upcoming indicators",
      "Quick view panel shows today's tasks, overdue, and this week",
      "Notification bell for tasks due today, tomorrow, or overdue",
      "Automatic overdue detection — never lose track of late tasks",
      "Rescheduling suggestions when too many tasks pile up on one day",
    ],
  },
  {
    icon: "🗂",
    title: "Organisation & Filtering",
    points: [
      "Built-in categories: All, Today, Personal, Work, Urgent, Overdue, Completed",
      "Create up to 3 custom categories to match your workflow",
      "Add multiple tags to any task for flexible filtering",
      "Search tasks instantly across all categories",
      "Reorder sidebar categories by dragging them into your preferred layout",
    ],
  },
  {
    icon: "🔒",
    title: "Security & Privacy",
    points: [
      "All accounts protected with bcrypt password hashing — passwords are never stored in plain text",
      "JWT-based authentication with 12-hour session expiry",
      "Each user's data is fully isolated — no cross-account access possible",
      "Secure API with token validation on every request",
      "Environment-variable-managed secrets — no hardcoded credentials in the codebase",
    ],
  },
  {
    icon: "🎨",
    title: "Personalisation",
    points: [
      "Dark and light theme, saved per account",
      "Custom sidebar layout — reorder and add your own categories",
      "Per-user preferences stored server-side — your settings follow you across devices",
      "Clean, distraction-free interface designed for focus",
    ],
  },
  {
    icon: "⚡",
    title: "Performance & Reliability",
    points: [
      "Built on React with optimistic UI updates — the app feels instant",
      "Flask REST API backend with SQLAlchemy ORM",
      "Undo support for task deletions and completions",
      "Fully responsive — works on desktop, tablet, and mobile",
      "Deployed on Vercel (frontend) and Render (backend) for global availability",
    ],
  },
];

const stats = [
  { value: "100%", label: "Free to use" },
  { value: "JWT", label: "Secure auth" },
  { value: "< 1s", label: "Response time" },
  { value: "∞", label: "Tasks you can create" },
];

export function LandingPage({ onGetStarted, onHome = () => {} }) {
  useEffect(() => {
    const taskEls = document.querySelectorAll(".tf-task");
    taskEls.forEach(t => {
      t.addEventListener("mouseenter", () => { t.style.transform = "translateY(-2px)"; t.style.background = "rgba(255,255,255,0.05)"; });
      t.addEventListener("mouseleave", () => { t.style.transform = "translateY(0)"; t.style.background = "rgba(255,255,255,0.03)"; });
    });

    // Intersection observer for reveal animations
    const els = document.querySelectorAll(".tf-reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("tf-revealed"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="tf-landing">
      <div className="tf-container">

        {/* Navbar */}
        <TopNav onHome={onHome} onGetStarted={onGetStarted} />

        {/* Hero */}
        <section className="tf-hero">
          <div className="tf-hero-left">
            <div className="tf-badge"><span className="tf-sparkle">✦</span>TASK MANAGEMENT. SIMPLIFIED.</div>
            <h1>Get things<br />done. Stay<br />in flow.</h1>
            <p>TaskFlow helps you organize your work and personal tasks in one clean, distraction-free space. No clutter, no complexity.</p>
            <div className="tf-actions">
              <button className="tf-primary-btn" onClick={onGetStarted}>Get started — it's free →</button>
              <a href="#about" className="tf-secondary-btn">Learn more →</a>
            </div>
          </div>

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

        {/* Features row */}
        <section className="tf-features" id="features">
          {features.map((f, i) => (
            <div key={i} className="tf-feature tf-reveal">
              <div className="tf-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Stats bar */}
        <section className="tf-stats tf-reveal">
          {stats.map((s, i) => (
            <div key={i} className="tf-stat">
              <div className="tf-stat-value">{s.value}</div>
              <div className="tf-stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Detailed features */}
        <section className="tf-details" id="about">
          <div className="tf-details-header tf-reveal">
            <div className="tf-section-badge">✦ EVERYTHING YOU NEED</div>
            <h2>Built for people who actually get things done</h2>
            <p>TaskFlow isn't just a to-do list. Here's what's under the hood.</p>
          </div>
          <div className="tf-details-grid">
            {detailedFeatures.map((f, i) => (
              <div key={i} className="tf-detail-card tf-reveal">
                <div className="tf-detail-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <ul>
                  {f.points.map((p, j) => (
                    <li key={j}><span className="tf-check">✓</span>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA bottom */}
        <section className="tf-bottom-cta tf-reveal">
          <div className="tf-badge" style={{ margin: "0 auto 24px" }}><span className="tf-sparkle">✦</span>FREE. NO CREDIT CARD. NO CATCH.</div>
          <h2>Start organizing your life today</h2>
          <p>Create an account in seconds and get your tasks under control.</p>
          <button className="tf-primary-btn" onClick={onGetStarted}>Get started — it's free →</button>
        </section>

      </div>

      {/* Footer */}
      <footer className="tf-footer">
        <div className="tf-footer-inner">
          <div className="tf-logo" style={{ fontSize: "1.4rem" }}>TaskFlow</div>
          <p>Built for people who get things done.</p>
          <button className="tf-signin-btn" onClick={onGetStarted}>Sign in</button>
        </div>
        <div className="tf-footer-copy">© 2026 TaskFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
