"use client"

import { useState } from "react"
import { Heart, Calendar } from "lucide-react"

const GalleryCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="card gallery-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={{ position: "relative" }}>
        <img src={item.imageUrl || "/placeholder.svg"} alt={item.description} className="gallery-image" />
        {isHovered && (
          <div className="gallery-overlay">
            <button className="btn" style={{ background: "rgba(255, 255, 255, 0.9)", color: "#1f2937" }}>
              View Details
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: "1rem" }}>
        <div
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: "500", color: "#1f2937" }}>{item.name}</h3>
            <p style={{ fontSize: "0.75rem", color: "#9333ea", fontWeight: "500" }}>{item.problemTitle}</p>
          </div>
          <button
            className="btn btn-ghost"
            style={{ width: "2rem", height: "2rem", padding: 0 }}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              size={20}
              style={{
                color: isLiked ? "#f9a8d4" : "#9ca3af",
                fill: isLiked ? "#f9a8d4" : "none",
              }}
            />
          </button>
        </div>

        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "0.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", fontSize: "0.75rem", color: "#9ca3af" }}>
          <Calendar size={12} style={{ marginRight: "0.25rem" }} />
          <span>{formatDate(item.submittedAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default GalleryCard
