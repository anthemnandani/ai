"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import axios from "axios"
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
      const response = await axios.get("/api/submissions/dates/available")
      setAvailableDates(response.data)
      if (response.data.length > 0 && !selectedDate) {
        setSelectedDate(response.data[0])
      }
    } catch (error) {
      console.error("Error fetching available dates:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = async (problemId) => {
    try {
      const response = await axios.get(`/api/submissions/${problemId}`)
      setSubmissions(response.data)
    } catch (error) {
      console.error("Error fetching submissions:", error)
    }
  }

  const fetchRecentSubmissions = async () => {
    try {
      const response = await axios.get("/api/submissions")
      setRecentSubmissions(response.data.slice(0, 10))
    } catch (error) {
      console.error("Error fetching recent submissions:", error)
    }
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
                  <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="select">
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {submissions.length > 0 ? (
              <div className="grid md:grid-cols-2" style={{ gap: "1.5rem" }}>
                {submissions.map((submission) => (
                  <GalleryCard key={submission._id} item={submission} />
                ))}
              </div>
            ) : (
              <div className="card empty-state">
                <p>No submissions found for the selected date.</p>
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
                    <div
                      key={submission._id}
                      className="sidebar-item"
                      onClick={() => setSelectedDate(submission.problemId)}
                    >
                      <img
                        src={submission.imageUrl || "/placeholder.svg"}
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
