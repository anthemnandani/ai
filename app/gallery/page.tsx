"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GalleryCard } from "@/components/gallery-card"
import { RealtimeIndicator } from "@/components/realtime-indicator"
import { CheckCircle, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { storageUtils } from "@/lib/storage"
import { useRealtimeSubmissions } from "@/hooks/use-realtime-submissions"
import { toast } from "sonner"

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const showPreview = searchParams.get("preview") === "true"
  const { submissions, loading } = useRealtimeSubmissions()

  const [selectedDate, setSelectedDate] = useState("")
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = () => {
      const userHasSubmitted = storageUtils.hasUserSubmittedToday()
      setHasAccess(userHasSubmitted || showPreview)

      // Get available dates from submissions
      const dates = [...new Set(submissions.map((s) => s.problemId))].sort().reverse()
      setAvailableDates(dates)

      if (dates.length > 0 && !selectedDate) {
        setSelectedDate(dates[0])
      }
    }

    checkAccess()
  }, [submissions, showPreview, selectedDate])

  useEffect(() => {
    if (showPreview) {
      toast.success("Submission successful! Welcome to the gallery.")
    }
  }, [showPreview])

  const filteredSubmissions = submissions.filter((s) => s.problemId === selectedDate)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Show lock screen if user hasn't submitted and not in preview mode
  if (!hasAccess && !showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8] py-12">
        <RealtimeIndicator />
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 rounded-xl shadow-md border-0">
              <div className="flex flex-col items-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-[#f5f0ff] flex items-center justify-center">
                  <Lock className="h-8 w-8 text-[#9333ea]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Gallery Access Locked</h1>
                <p className="text-gray-600 leading-relaxed">
                  To maintain fairness and encourage original thinking, you need to submit your solution to today's
                  challenge before viewing other submissions. This ensures everyone gets a chance to solve the problem
                  independently first.
                </p>
                <Link href="/submit">
                  <Button className="h-12 px-8 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 text-white rounded-full shadow-md">
                    Submit Today's Solution
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8] py-12">
        <RealtimeIndicator />
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 rounded-xl shadow-md border-0">
              <div className="flex flex-col items-center space-y-6">
                <Loader2 className="h-16 w-16 text-[#9333ea] animate-spin" />
                <h1 className="text-2xl font-bold text-gray-800">Loading Gallery...</h1>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8] py-12">
      <RealtimeIndicator />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] bg-clip-text text-transparent">
            {showPreview ? "Welcome to the Gallery!" : "Community Design Gallery"}
          </h1>

          {showPreview && (
            <Card className="p-6 rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-sm mb-8">
              <div className="flex items-center justify-center text-center space-x-4">
                <CheckCircle className="h-8 w-8 text-[#10b981]" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Submission Successful!</h3>
                  <p className="text-gray-600">
                    Your design has been added to the gallery. Explore other creative solutions below.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Gallery Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Date Filter */}
              <Card className="p-4 rounded-xl shadow-md border-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Browse Solutions</h2>
                  {availableDates.length > 0 ? (
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map((date) => (
                          <SelectItem key={date} value={date}>
                            {formatDate(date)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-500">No submissions yet</p>
                  )}
                </div>
              </Card>

              {/* Current Challenge Info */}
              {selectedDate && (
                <Card className="p-6 rounded-xl shadow-md border-0 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Challenge: {formatDate(selectedDate)}
                      </h3>
                      <p className="text-gray-600">
                        {filteredSubmissions.length > 0
                          ? `Viewing ${filteredSubmissions.length} solution${filteredSubmissions.length !== 1 ? "s" : ""} for this challenge`
                          : "No solutions submitted for this challenge yet"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Real-time Updates</p>
                      <p className="font-mono text-sm text-green-600">🟢 Active</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Solutions Grid */}
              {filteredSubmissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSubmissions.map((submission) => (
                    <GalleryCard key={submission.id} item={submission} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 rounded-xl shadow-md border-0 text-center">
                  <p className="text-gray-600">No submissions found for the selected date.</p>
                  {availableDates.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Try selecting a different date from the dropdown above.
                    </p>
                  )}
                </Card>
              )}
            </div>

            {/* Right Side Panel - Recent Submissions */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Card className="p-6 rounded-xl shadow-md border-0">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Recent Submissions</h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {submissions.slice(0, 10).map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={submission.imageUrl || "/placeholder.svg"}
                            alt={submission.designTitle}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 truncate">{submission.name}</p>
                          <p className="text-xs text-gray-500 truncate">{submission.designTitle}</p>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">{submission.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(submission.submittedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
