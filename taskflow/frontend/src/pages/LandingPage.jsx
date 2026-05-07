import { useEffect } from "react";

const features = [
  { icon: "✓", title: "Smart Task Management", desc: "Organize tasks with categories, tags, and due dates. Everything in one place." },
  { icon: "📅", title: "Due Date Tracking", desc: "Never miss a deadline. Visual indicators for overdue, today, and upcoming tasks." },
  { icon: "🔔", title: "Reminders & Notifications", desc: "Built-in bell keeps you on top of what's due today, tomorrow, and overdue." },
  { icon: "🌙", title: "Dark & Light Themes", desc: "Switch between dark and light modes anytime. Comfortable for any time of day." },
  { icon: "✏", title: "Bulk Edit Mode", desc: "Select multiple tasks to complete or delete them all at once. Work faster." },
  { icon: "⠿", title: "Drag & Drop", desc: "Prioritize your work your way. Drag tasks into the order that makes sense." },
];

const mockTasks = [
  { title: "Finish landing page design", cat: "Work", catColor: "#6366f1", time: "10:00 AM" },
  { title: "Reply to client email", cat: "Work", catColor: "#6366f1", time: "11:30 AM" },
  { title: "Grocery shopping", cat: "Personal", catColor: "#10b981", time: "2:00 PM" },
  { title: "Read 20 pages", cat: "Study", catColor: "#f59e0b", time: "4:00 PM" },
  { title: "Workout", cat: "Health", catColor: "#ef4444", time: "6:00 PM" },
];

const mockUpcoming = [
  { title: "Team meeting", cat: "Work", catColor: "#6366f1", time: "Tomorrow" },
  { title: "Project proposal", cat: "Work", catColor: "#6366f1", time: "Wed, 12" },
  { title: "Dentist appointment", cat: "Personal", catColor: "#10b981", time: "Fri, 14" },
];

export function LandingPage({ onGetStarted }) {
  useEffect(() => {
    const els = document.querySelectorAll(".lp2-reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lp2-visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp2">
      <div className="lp2-bg" />

      <nav className="lp2-nav">
        <span className="lp2-brand">Task<span>Flow</span></span>
        <div className="lp2-nav-links">
          <a href="#features">Features</a>
          <a href="#features">Solutions</a>
        </div>
        <button className="lp2-signin" onClick={onGetStarted}>Sign in</button>
      </nav>

      <section className="lp2-hero">
        <div className="lp2-hero-left">
          <div className="lp2-badge">✦ TASK MANAGEMENT. SIMPLIFIED.</div>
          <h1 className="lp2-h1">Get things<br/>done. Stay<br/>in flow.</h1>
          <p className="lp2-sub">TaskFlow helps you organize your work and personal tasks in one clean, distraction-free space. No clutter, no complexity.</p>
          <div className="lp2-hero-btns">
            <button className="lp2-cta" onClick={onGetStarted}>Get started — it's free →</button>
            <button className="lp2-ghost" onClick={onGetStarted}>Learn more →</button>
          </div>
        </div>

        <div className="lp2-mockup">
          <div className="lp2-app">
            <div className="lp2-app-header">
              <span className="lp2-app-brand">TaskFlow</span>
              <div className="lp2-app-search">
                <span>⌕</span>
                <span style={{color:"rgba(255,255,255,0.3)", fontSize:12}}>Search tasks...</span>
              </div>
              <div className="lp2-app-icons">
                <span style={{fontSize:14}}>🔔</span>
                <div className="lp2-avatar">AR</div>
              </div>
            </div>
            <div className="lp2-app-body">
              <div className="lp2-app-sidebar">
                {["Inbox","Today","Upcoming","Projects","Calendar","Tags"].map((item,i)=>(
                  <div key={item} className={`lp2-sidebar-item${i===1?" lp2-active":""}`}>
                    <span className="lp2-sdot"/>
                    <span>{item}</span>
                    {i===1&&<span className="lp2-sbadge">6</span>}
                  </div>
                ))}
                <div className="lp2-ssection">Projects</div>
                {[{n:"Work",c:"#6366f1"},{n:"Personal",c:"#3b82f6"},{n:"Study",c:"#10b981"},{n:"Health",c:"#f59e0b"}].map(p=>(
                  <div key={p.n} className="lp2-pitem">
                    <span className="lp2-pdot" style={{background:p.c}}/>
                    <span>{p.n}</span>
                  </div>
                ))}
              </div>
              <div className="lp2-app-main">
                <div className="lp2-view-cal">📅 View calendar</div>
                <div className="lp2-stitle">Today</div>
                {mockTasks.map((t,i)=>(
                  <div key={i} className="lp2-trow">
                    <div className="lp2-tcheck"/>
                    <span className="lp2-ttitle">{t.title}</span>
                    <span className="lp2-tcat" style={{background:t.catColor+"22",color:t.catColor}}>{t.cat}</span>
                    <span className="lp2-ttime">{t.time}</span>
                  </div>
                ))}
                <div className="lp2-stitle lp2-mt">Upcoming</div>
                {mockUpcoming.map((t,i)=>(
                  <div key={i} className="lp2-trow">
                    <div className="lp2-tcheck"/>
                    <span className="lp2-ttitle">{t.title}</span>
                    <span className="lp2-tcat" style={{background:t.catColor+"22",color:t.catColor}}>{t.cat}</span>
                    <span className="lp2-ttime">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp2-features" id="features">
        <div className="lp2-fgrid">
          {features.map((f,i)=>(
            <div key={i} className="lp2-reveal lp2-feat">
              <div className="lp2-ficon">{f.icon}</div>
              <div>
                <div className="lp2-ftitle">{f.title}</div>
                <div className="lp2-fdesc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="lp2-footer">
        <span className="lp2-brand">Task<span>Flow</span></span>
        <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>© 2026 TaskFlow. Built for people who get things done.</span>
        <button className="lp2-signin" onClick={onGetStarted}>Get started</button>
      </footer>
    </div>
  );
}
