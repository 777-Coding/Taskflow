import { useEffect, useRef } from "react";

const features = [
  {
    icon: "✓",
    title: "Smart Task Management",
    desc: "Create, organize, and track tasks with categories, tags, and due dates. Everything in one place.",
  },
  {
    icon: "📅",
    title: "Due Date Tracking",
    desc: "Never miss a deadline. Get visual indicators for overdue, today, and upcoming tasks at a glance.",
  },
  {
    icon: "🔔",
    title: "Reminders & Notifications",
    desc: "Built-in notification bell keeps you on top of what's due today, tomorrow, and overdue.",
  },
  {
    icon: "⠿",
    title: "Drag & Drop Reordering",
    desc: "Prioritize your work your way. Drag tasks into the order that makes sense for you.",
  },
  {
    icon: "🌙",
    title: "Dark & Light Theme",
    desc: "Easy on the eyes any time of day. Switch between dark and light mode instantly.",
  },
  {
    icon: "✏",
    title: "Bulk Edit Mode",
    desc: "Select multiple tasks to complete or delete them all at once. Work faster, not harder.",
  },
];

export function LandingPage({ onGetStarted }) {
  const heroRef = useRef();

  useEffect(() => {
    const els = document.querySelectorAll(".lp-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lp-visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp-wrap">
      <div className="lp-bg" />

      {/* Nav */}
      <nav className="lp-nav">
        <span className="lp-brand">Task<span>Flow</span></span>
        <button className="lp-nav-btn" onClick={onGetStarted}>Sign in</button>
      </nav>

      {/* Hero */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-badge">✦ Task management, simplified</div>
        <h1 className="lp-hero-title">
          Get things done.<br />
          <span className="lp-accent">Stay in flow.</span>
        </h1>
        <p className="lp-hero-sub">
          TaskFlow helps you organize your work and personal tasks in one clean, distraction-free space. No clutter, no complexity.
        </p>
        <div className="lp-hero-btns">
          <button className="lp-cta" onClick={onGetStarted}>Get started — it's free</button>
          <button className="lp-cta-ghost" onClick={onGetStarted}>Sign in</button>
        </div>
        <div className="lp-hero-tags">
          <span>🔒 Secure accounts</span>
          <span>⚡ Fast & responsive</span>
          <span>📱 Works on mobile</span>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features">
        <div className="lp-reveal lp-section-label">Features</div>
        <h2 className="lp-reveal lp-section-title">Everything you need, nothing you don't</h2>
        <div className="lp-grid">
          {features.map((f, i) => (
            <div key={i} className="lp-reveal lp-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="lp-card-icon">{f.icon}</div>
              <h3 className="lp-card-title">{f.title}</h3>
              <p className="lp-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="lp-bottom-cta lp-reveal">
        <h2>Ready to get organized?</h2>
        <p>Join TaskFlow and start managing your tasks the smart way.</p>
        <button className="lp-cta" onClick={onGetStarted}>Create free account</button>
      </section>

      <footer className="lp-footer">
        <span className="lp-brand">Task<span>Flow</span></span>
        <span className="lp-footer-copy">Built for people who get things done.</span>
      </footer>
    </div>
  );
}
