import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          AI Design Arena
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/submit" className={location.pathname === "/submit" ? "active" : ""}>
              Submit
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={location.pathname === "/gallery" ? "active" : ""}>
              Gallery
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
