"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

const SubmitPage = () => {
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designTitle: "",
    description: "",
    brandName: "",
    aiTool: "",
    image: null,
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState("")

  useEffect(() => {
    fetchTodaysChallenge()
  }, [])

  const fetchTodaysChallenge = async () => {
    try {
      const response = await axios.get("/api/challenge/today")
      setChallenge(response.data)
      if (response.data) {
        setFormData((prev) => ({ ...prev, brandName: response.data.brandName }))
      }
    } catch (error) {
      console.error("Error fetching challenge:", error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key])
      })

      await axios.post("/api/submissions", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success("Design submitted successfully!")
      navigate("/gallery")
    } catch (error) {
      toast.error(error.response?.data?.error || "Error submitting design")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem" }}>
        Submit Your Design
      </h1>

      {challenge && (
        <div className="card">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Today's Challenge: {challenge.title}
          </h2>
          <h3 style={{ color: "#667eea", marginBottom: "0.5rem" }}>Brand: {challenge.brandName}</h3>
          <p style={{ color: "#555", lineHeight: "1.6" }}>{challenge.description}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Design Title</label>
            <input
              type="text"
              name="designTitle"
              value={formData.designTitle}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe your design approach and AI prompts used..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">AI Tool Used</label>
            <select name="aiTool" value={formData.aiTool} onChange={handleInputChange} className="form-select" required>
              <option value="">Select AI Tool</option>
              <option value="midjourney">Midjourney</option>
              <option value="dall-e">DALL-E</option>
              <option value="stable-diffusion">Stable Diffusion</option>
              <option value="firefly">Adobe Firefly</option>
              <option value="canva-ai">Canva AI</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Design</label>
            <div className="file-upload" onClick={() => document.getElementById("file-input").click()}>
              <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} required />
              <p>Click to upload your design</p>
              <p style={{ fontSize: "0.875rem", color: "#666" }}>PNG, JPG up to 10MB</p>
            </div>
          </div>

          {preview && (
            <div className="form-group">
              <label className="form-label">Preview</label>
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "auto",
                  borderRadius: "12px",
                }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading"></span> : "Submit Design"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubmitPage
