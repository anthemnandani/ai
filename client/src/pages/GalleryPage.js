"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Lock, CheckCircle } from "lucide-react"
import GalleryCard from "../components/GalleryCard"

const GalleryPage = () => {
  const [searchParams] = useSearchParams()
  const showPreview = searchParams.get("preview") === "true"
  const [submissions, setSubmissions] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [availableDates, setAvailableDates] = useState([])
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recentSubmissions, setRecentSubmissions] = useState([])

  useEffect(() => {
    checkAccess()
    fetchAvailableDates()
    fetchRecentSubmissions()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchSubmissions(selectedDate)
    }
  }, [selectedDate])

  const checkAccess = () => {
    const hasSubmittedToday = localStorage.getItem("hasSubmittedToday") === "true"
    const lastSubmissionDate = localStorage.getItem("lastSubmissionDate")
    const today = new Date().toISOString().split("T")[0]

    setHasAccess(hasSubmittedToday && lastSubmissionDate === today)
  }

  const fetchAvailableDates = async () => {
    try {
      // For demo purposes, using localStorage data
      const storedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]")
      const dates = [...new Set(storedSubmissions.map((s) => s.problemId))].sort().reverse()
      setAvailableDates(dates)
      if (dates.length > 0 && !selectedDate) {
        setSelectedDate(dates[0])
      }
    } catch (error) {
      console.error("Error fetching available dates:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = (problemId) => {
    try {
      // For demo purposes, using localStorage data
      const storedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]")
      const filtered = storedSubmissions.filter((s) => s.problemId === problemId)
      setSubmissions(filtered)
      console.log("Fetched submissions for", problemId, ":", filtered) // Debug log
    } catch (error) {
      console.error("Error fetching submissions:", error)
    }
  }

  const fetchRecentSubmissions = () => {
    try {
      // For demo purposes, using localStorage data
      const storedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]")
      setRecentSubmissions(storedSubmissions.slice(-10).reverse())
    } catch (error) {
      console.error("Error fetching recent submissions:", error)
    }
  }

  const handleViewChallenge = (problemId) => {
    console.log("Switching to challenge:", problemId) // Debug log
    setSelectedDate(problemId)
    fetchSubmissions(problemId)
    // Scroll to top to show the selected challenge
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="loading"></div>
            <p style={{ marginTop: "1rem" }}>Loading gallery...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hasAccess && !showPreview) {
    return (
      <div className="page">
        <div className="container">
          <div className="lock-screen">
            <div className="card lock-content">
              <div className="lock-icon">
                <Lock size={32} />
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>Gallery Access Locked</h1>
              <p style={{ color: "#6b7280", lineHeight: "1.6", marginBottom: "2rem" }}>
                To maintain fairness and encourage original thinking, you need to submit your solution to today's
                challenge before viewing other submissions. This ensures everyone gets a chance to solve the problem
                independently first.
              </p>
              <Link to="/submit" className="btn btn-primary" style={{ padding: "0.75rem 2rem" }}>
                Submit Today's Solution
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPreview) {
    return (
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title gradient-text">Submission Successful!</h1>
          </div>

          <div className="card" style={{ padding: "2rem", textAlign: "center", maxWidth: "32rem", margin: "0 auto" }}>
            <div className="success-icon">
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
              Your solution has been submitted!
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              You can now explore other community solutions and get inspired by different approaches to the same
              problem.
            </p>
            <Link to="/gallery" className="btn btn-primary">
              Explore Community Solutions
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title gradient-text">Community Solutions Gallery</h1>
        </div>

        <div className="grid lg:grid-cols-8" style={{ gap: "2rem" }}>
          <div style={{ gridColumn: "span 5" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="card" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Browse Solutions</h2>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      console.log("Dropdown changed to:", e.target.value) // Debug log
                      handleViewChallenge(e.target.value)
                    }}
                    className="select"
                  >
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Current Challenge Info */}
            {selectedDate && (
              <div
                className="card"
                style={{
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  background: "linear-gradient(to right, #f8fafc, #f1f5f9)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Challenge: {formatDate(selectedDate)}
                    </h3>
                    <p style={{ color: "#6b7280" }}>
                      {submissions.length > 0
                        ? `Viewing ${submissions.length} solution${submissions.length !== 1 ? "s" : ""} for this challenge`
                        : "No solutions submitted for this challenge yet"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Problem ID</p>
                    <p style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#374151" }}>{selectedDate}</p>
                  </div>
                </div>
              </div>
            )}

            {submissions.length > 0 ? (
              <div className="grid md:grid-cols-2" style={{ gap: "1.5rem" }}>
                {submissions.map((submission) => (
                  <GalleryCard key={submission.id || submission._id} item={submission} />
                ))}
              </div>
            ) : (
              <div className="card empty-state">
                <p>No submissions found for the selected date.</p>
                {availableDates.length > 0 && (
                  <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
                    Try selecting a different date from the dropdown above.
                  </p>
                )}
              </div>
            )}
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div className="sidebar">
              <div className="card" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Submissions</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    maxHeight: "37.5rem",
                    overflowY: "auto",
                  }}
                >
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id || submission._id} className="sidebar-item" style={{ cursor: "pointer" }}>
                      <img
                        src={submission.filePreview || submission.imageUrl || "/placeholder.svg"}
                        alt={submission.description}
                        className="sidebar-image"
                      />
                      <div className="sidebar-content">
                        <p className="sidebar-name">{submission.name}</p>
                        <p className="sidebar-problem">{submission.problemTitle}</p>
                        <p className="sidebar-description">{submission.description}</p>
                        <button
                          className="btn btn-ghost"
                          style={{
                            marginTop: "0.25rem",
                            height: "1.75rem",
                            padding: "0 0.5rem",
                            fontSize: "0.75rem",
                            color: "#9333ea",
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log("Sidebar button clicked for:", submission.problemId) // Debug log
                            handleViewChallenge(submission.problemId)
                          }}
                        >
                          View Challenge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalleryPage
