import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="page">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: "80vh",
            gap: "2rem",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <h1 className="page-title gradient-text">TuteDude Daily Challenge</h1>
            <p className="page-subtitle">
              Solve today's design challenge and explore creative solutions from the community. Submit your solution
              first to unlock the gallery and see how others approached the same problem.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link to="/submit" className="btn btn-primary" style={{ padding: "0.75rem 2rem" }}>
              Take Today's Challenge
            </Link>
            <Link to="/gallery" className="btn btn-outline" style={{ padding: "0.75rem 2rem" }}>
              View Previous Challenges
            </Link>
          </div>

          <div className="how-it-works">
            <h2>How it works</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3 className="step-title">Get Challenge</h3>
                <p className="step-description">Receive a new design problem statement every day</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3 className="step-title">Submit Solution</h3>
                <p className="step-description">Upload your design solution with description</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3 className="step-title">Explore Gallery</h3>
                <p className="step-description">View and get inspired by community solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
