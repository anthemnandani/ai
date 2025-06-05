"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import io from "socket.io-client"
import toast from "react-hot-toast"

const GalleryPage = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    fetchSubmissions()

    // Initialize socket connection
    const socket = io(process.env.NODE_ENV === "production" ? "" : "http://localhost:5000")

    socket.on("connect", () => {
      setConnected(true)
      console.log("Connected to real-time updates")
    })

    socket.on("disconnect", () => {
      setConnected(false)
    })

    // Listen for new submissions
    socket.on("newSubmission", (newSubmission) => {
      setSubmissions((prev) => [newSubmission, ...prev])
      toast.success("New submission received!")
    })

    return () => socket.disconnect()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get("/api/submissions")
      setSubmissions(response.data)
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast.error("Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="loading" style={{ width: "40px", height: "40px" }}></div>
          <p style={{ marginTop: "1rem", color: "#666" }}>Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {connected && <div className="realtime-indicator">🟢 Real-time updates active</div>}

      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem" }}>
        Design Gallery
      </h1>

      <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
        {submissions.length} submissions • Updates in real-time
      </p>

      {submissions.length === 0 ? (
        <div className="card text-center">
          <h3 style={{ marginBottom: "1rem" }}>No submissions yet</h3>
          <p style={{ color: "#666" }}>Be the first to submit a design!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {submissions.map((submission) => (
            <div key={submission._id} className="gallery-item">
              <img
                src={submission.imageUrl || "/placeholder.svg"}
                alt={submission.designTitle}
                className="gallery-image"
              />
              <div className="gallery-content">
                <h3 className="gallery-title">{submission.designTitle}</h3>
                <div className="gallery-meta">
                  <strong>{submission.name}</strong> • {submission.brandName} • {submission.aiTool}
                  <br />
                  <span style={{ fontSize: "0.75rem", color: "#999" }}>{formatDate(submission.submittedAt)}</span>
                </div>
                <p className="gallery-description">{submission.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GalleryPage
