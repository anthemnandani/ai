"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GalleryCard } from "@/components/gallery-card"
import { PreviewCard } from "@/components/preview-card"
import { CheckCircle, Lock } from "lucide-react"
import Link from "next/link"

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

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const showPreview = searchParams.get("preview") === "true"
  const [submitted, setSubmitted] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [hasAccess, setHasAccess] = useState(false)
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    // Check if user has submitted today
    const hasSubmittedToday = localStorage.getItem("hasSubmittedToday") === "true"
    const lastSubmissionDate = localStorage.getItem("lastSubmissionDate")
    const today = new Date().toISOString().split("T")[0]

    setHasAccess(hasSubmittedToday && lastSubmissionDate === today)

    // Load submissions from localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]")
    setSubmissions(storedSubmissions)

    // Get available dates
    const dates = [...new Set(storedSubmissions.map((s: Submission) => s.problemId))].sort().reverse()
    setAvailableDates(dates)

    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]) // Default to most recent
    }

    // Find user's latest submission for preview
    if (storedSubmissions.length > 0) {
      const latest = storedSubmissions[storedSubmissions.length - 1]
      setUserSubmission(latest)
    }
  }, [selectedDate])

  const handleSubmitFinal = () => {
    setSubmitted(true)
  }

  const filteredSubmissions = submissions.filter((s) => s.problemId === selectedDate)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!hasAccess && !showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8] py-12">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] bg-clip-text text-transparent">
            {showPreview ? "Preview Your Submission" : "Community Solutions Gallery"}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Preview or Gallery Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {showPreview && userSubmission ? (
                <div className="space-y-6">
                  <PreviewCard data={userSubmission} />

                  {submitted ? (
                    <Card className="p-6 rounded-xl shadow-md border-0 bg-white/80 backdrop-blur-sm">
                      <div className="flex flex-col items-center text-center space-y-4 py-6">
                        <div className="h-16 w-16 rounded-full bg-[#ecfdf5] flex items-center justify-center">
                          <CheckCircle className="h-10 w-10 text-[#10b981]" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Submission Successful!</h3>
                        <p className="text-gray-600 max-w-md">
                          Your solution has been submitted successfully. You can now explore other community solutions
                          and get inspired by different approaches to the same problem.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4 border-[#d8b4fe] text-[#9333ea] hover:bg-[#f5f0ff]"
                          onClick={() => (window.location.href = "/gallery")}
                        >
                          Explore Community Solutions
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Button
                      onClick={handleSubmitFinal}
                      className="w-full h-12 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 text-white rounded-full shadow-md"
                    >
                      Confirm Submission
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Date Filter */}
                  <Card className="p-4 rounded-xl shadow-md border-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800">Browse Solutions</h2>
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
                    </div>
                  </Card>

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
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Right Side Panel - Recent Submissions */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Card className="p-6 rounded-xl shadow-md border-0">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Recent Submissions</h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {submissions
                      .slice(-10)
                      .reverse()
                      .map((submission) => (
                        <div
                          key={submission.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={submission.filePreview || "/placeholder.svg"}
                              alt={submission.description}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-800 truncate">{submission.name}</p>
                            <p className="text-xs text-gray-500 truncate">{submission.problemTitle}</p>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1">{submission.description}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1 h-7 px-2 text-xs text-[#9333ea] hover:bg-[#f5f0ff] hover:text-[#7e22ce]"
                              onClick={() => setSelectedDate(submission.problemId)}
                            >
                              View Challenge
                            </Button>
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
