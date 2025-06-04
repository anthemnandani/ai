import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo"></div>
            <span className="navbar-title">TuteDude</span>
          </Link>

          <nav className="navbar-nav">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/submit" className="navbar-link">
              Submit
            </Link>
            <Link to="/gallery" className="navbar-link">
              Gallery
            </Link>
          </nav>

          <div className="navbar-actions">
            <button className="btn btn-ghost" style={{ display: "none" }}>
              Sign In
            </button>
            <button className="btn btn-primary">Join</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
