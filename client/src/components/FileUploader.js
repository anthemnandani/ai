"use client"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

const FileUploader = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState("")
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
        setFileName(file.name)
        onFileSelect(file)
      } else {
        alert("Only image files are allowed!")
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        setFileName(file.name)
        onFileSelect(file)
      } else {
        alert("Only image files are allowed!")
      }
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
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
      <div className="file-upload-icon">
        <Upload size={24} />
      </div>
      <div style={{ marginBottom: "0.25rem" }}>
        {fileName ? (
          <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
            Selected file: <span style={{ color: "#9333ea" }}>{fileName}</span>
          </p>
        ) : (
          <>
            <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>Drag and drop your image here</p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>PNG, JPG up to 10MB</p>
          </>
        )}
      </div>
      <button type="button" className="btn btn-outline" style={{ marginTop: "0.5rem" }} onClick={handleButtonClick}>
        {fileName ? "Change File" : "Browse Files"}
      </button>
    </div>
  )
}

export default FileUploader
