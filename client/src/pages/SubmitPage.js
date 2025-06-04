"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ProblemStatement from "../components/ProblemStatement"
import FileUploader from "../components/FileUploader"
import TipCard from "../components/TipCard"

const SubmitPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    file: null,
  })
  const [todaysProblem, setTodaysProblem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    fetchTodaysProblem()
  }, [])

  const fetchTodaysProblem = async () => {
    try {
      const response = await axios.get("/api/problems/today")
      setTodaysProblem(response.data)
    } catch (error) {
      console.error("Error fetching today's problem:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, file }))
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!todaysProblem) return

    setLoading(true)
    try {
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("email", formData.email)
      submitData.append("description", formData.description)
      submitData.append("image", formData.file)
      submitData.append("problemId", todaysProblem.date)
      submitData.append("problemTitle", todaysProblem.title)

      await axios.post("/api/submissions", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Mark as submitted in localStorage for access control
      localStorage.setItem("hasSubmittedToday", "true")
      localStorage.setItem("lastSubmissionDate", todaysProblem.date)

      navigate("/gallery?preview=true")
    } catch (error) {
      console.error("Error submitting solution:", error)
      alert("Error submitting solution. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!todaysProblem) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div className="loading"></div>
            <p style={{ marginTop: "1rem" }}>Loading today's challenge...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title gradient-text">Today's Design Challenge</h1>
        </div>

        <div className="grid lg:grid-cols-8" style={{ gap: "2rem" }}>
          <div className="lg:col-span-8" style={{ gridColumn: "span 5" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <ProblemStatement problem={todaysProblem} />
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Submit Your Solution</h2>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Solution Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your design approach, key decisions, and how you addressed the requirements..."
                    className="textarea"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Upload Design Solution</label>
                  <FileUploader onFileSelect={handleFileChange} />
                </div>

                {previewUrl && (
                  <div>
                    <p className="form-label">Preview:</p>
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="preview-image"
                      style={{ maxWidth: "24rem" }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: "100%", padding: "0.75rem" }}
                >
                  {loading ? <span className="loading"></span> : "Submit Solution"}
                </button>
              </form>
            </div>
          </div>

          <div style={{ gridColumn: "span 3" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <TipCard
                title="Submission Tips"
                tips={[
                  "Address all requirements in the problem statement",
                  "Explain your design decisions clearly",
                  "Use high-quality images (PNG or JPG)",
                  "Consider user experience and accessibility",
                  "Show your creative process and thinking",
                ]}
              />

              <div
                className="card"
                style={{
                  padding: "2rem",
                  background: "#f5f0ff",
                  textAlign: "center",
                  display: "none",
                }}
              >
                <img
                  src="/api/placeholder/320/320"
                  alt="TuteDude mascot"
                  style={{ width: "100%", height: "auto", borderRadius: "0.5rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitPage
