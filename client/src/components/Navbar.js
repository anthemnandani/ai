import { Link, useLocation } from "react-router-dom"
import { Palette, Trophy, GalleryThumbnailsIcon as Gallery, Upload, Home } from "lucide-react"

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <Palette size={20} />
          </div>
          <span className="navbar-title">AI Design Arena</span>
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              <Home size={18} />
              Home
            </Link>
          </li>
          <li>
            <Link to="/challenge" className={isActive("/challenge") ? "active" : ""}>
              <Palette size={18} />
              Today's Challenge
            </Link>
          </li>
          <li>
            <Link to="/submit" className={isActive("/submit") ? "active" : ""}>
              <Upload size={18} />
              Submit Design
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={isActive("/gallery") ? "active" : ""}>
              <Gallery size={18} />
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className={isActive("/leaderboard") ? "active" : ""}>
              <Trophy size={18} />
              Leaderboard
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <Link to="/submit" className="btn btn-primary">
            Submit Design
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
