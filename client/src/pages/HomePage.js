"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const HomePage = () => {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentSubmissions, setRecentSubmissions] = useState([])
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    activeDesigners: 0,
    challengesCompleted: 0,
  })

  useEffect(() => {
    fetchTodaysChallenge()
  }, [])

  const fetchTodaysChallenge = async () => {
    try {
      const response = await axios.get("/api/challenge/today")
      setChallenge(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching challenge:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="loading" style={{ width: "40px", height: "40px" }}></div>
          <p style={{ marginTop: "1rem", color: "#666" }}>Loading challenge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>AI Design Arena</h1>
        <p style={{ fontSize: "1.25rem", color: "#555", marginBottom: "2rem" }}>
          Create stunning AI-powered graphics for real brands. Submit your designs and see others' submissions in
          real-time.
        </p>

        {challenge ? (
          <div className="card">
            <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Today's Challenge: {challenge.title}
            </h2>
            <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Brand: {challenge.brandName}</h3>
            <p style={{ color: "#555", lineHeight: "1.6", marginBottom: "2rem" }}>{challenge.description}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <Link to="/submit" className="btn btn-primary">
                Submit Design
              </Link>
              <Link to="/gallery" className="btn btn-secondary">
                View Gallery
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "1rem" }}>No Active Challenge</h2>
            <p style={{ color: "#555", marginBottom: "2rem" }}>There is no active challenge at the moment.</p>
            <Link to="/gallery" className="btn btn-secondary">
              View Gallery
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
