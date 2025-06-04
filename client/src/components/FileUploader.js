"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

const FileUploader = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        onFileSelect(file)
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`file-upload ${isDragging ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
      <div className="file-upload-icon">
        <Upload size={24} />
      </div>
      <div style={{ marginBottom: "0.25rem" }}>
        <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>Drag and drop your image here</p>
        <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>PNG, JPG up to 10MB</p>
      </div>
      <button type="button" className="btn btn-outline" style={{ marginTop: "0.5rem" }}>
        Browse Files
      </button>
    </div>
  )
}

export default FileUploader
