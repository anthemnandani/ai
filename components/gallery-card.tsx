"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Calendar } from "lucide-react"
import { useState } from "react"

interface Submission {
  id: number
  name: string
  email: string
  description: string
  filePreview: string
  problemId: string
  problemTitle: string
  submittedAt: string
}

interface GalleryCardProps {
  item: Submission
}

export function GalleryCard({ item }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card
      className="overflow-hidden rounded-xl shadow-md border-0 transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video">
        <img
          src={item.filePreview || "/placeholder.svg"}
          alt={item.description}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
            <Button variant="secondary" className="bg-white/90 hover:bg-white text-gray-800">
              View Details
            </Button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{item.name}</h3>
            <p className="text-xs text-[#9333ea] font-medium">{item.problemTitle}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={`h-5 w-5 ${isLiked ? "fill-[#f9a8d4] text-[#f9a8d4]" : "text-gray-400"}`} />
          </Button>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(item.submittedAt)}</span>
        </div>
      </div>
    </Card>
  )
}
