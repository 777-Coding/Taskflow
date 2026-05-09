export function TopNav({ onHome, onGetStarted, showSignIn = true }) {
  return (
    <nav className="tf-topnav">
      <div className="tf-topnav-inner">
        <button className="tf-topnav-logo" onClick={onHome}>TaskFlow</button>
        <div className="tf-topnav-links">
          <button onClick={onHome}>Home</button>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
        {showSignIn && (
          <button className="tf-topnav-btn" onClick={onGetStarted}>Sign in</button>
        )}
      </div>
    </nav>
  );
}
