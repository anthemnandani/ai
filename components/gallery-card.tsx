"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, User } from "lucide-react"
import { useState } from "react"

interface GalleryCardProps {
  item: {
    id: number
    name: string
    email: string
    description: string
    imageUrl: string
    problemTitle: string
    submittedAt: string
  }
}

export function GalleryCard({ item }: GalleryCardProps) {
  const [showFullImage, setShowFullImage] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Card className="overflow-hidden rounded-xl shadow-md border-0 hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-gray-100">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.description}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={() => setShowFullImage(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm text-gray-800">{item.name}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(item.submittedAt)}</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-800 text-sm">{item.problemTitle}</h3>

          <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 border-[#d8b4fe] text-[#9333ea] hover:bg-[#f5f0ff]"
            onClick={() => setShowFullImage(true)}
          >
            View Full Solution
          </Button>
        </div>
      </Card>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.description}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setShowFullImage(false)}
            >
              ✕
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 rounded-b-lg">
              <h3 className="font-semibold">{item.problemTitle}</h3>
              <p className="text-sm opacity-90">by {item.name}</p>
              <p className="text-sm mt-2">{item.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
