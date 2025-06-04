"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { TipCard } from "@/components/tip-card"
import { ProblemStatement } from "@/components/problem-statement"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

// Extended daily problem statements with more variety
const DAILY_PROBLEMS = [
  {
    date: "2024-12-06",
    title: "Smart Home Dashboard",
    description:
      "Design a minimalist dashboard interface for a smart home app. The dashboard should display key metrics like temperature, energy usage, security status, and quick controls for lights and appliances. Focus on clean typography, intuitive icons, and a calming color palette.",
    requirements: [
      "Include at least 4 different widget types",
      "Use a grid-based layout",
      "Implement dark/light mode considerations",
      "Show real-time data visualization",
    ],
  },
  {
    date: "2024-12-07",
    title: "Food Delivery Mobile App",
    description:
      "Create a mobile app interface for a food delivery service. Design the main browsing experience, restaurant details, and checkout flow. Focus on making food look appetizing and the ordering process seamless.",
    requirements: [
      "Restaurant listing with filters",
      "Food item cards with images and ratings",
      "Shopping cart and checkout flow",
      "Order tracking interface",
    ],
  },
  {
    date: "2024-12-08",
    title: "Online Learning Platform",
    description:
      "Design a modern e-learning platform interface. Include course discovery, video player, progress tracking, and student dashboard. Make it engaging for learners of all ages.",
    requirements: [
      "Course catalog with search and filters",
      "Video player with notes and bookmarks",
      "Progress tracking dashboard",
      "Interactive quiz interface",
    ],
  },
  {
    date: "2024-12-09",
    title: "Fitness Tracking App",
    description:
      "Create a comprehensive fitness app that tracks workouts, nutrition, and health metrics. Design should motivate users and make complex data easy to understand.",
    requirements: [
      "Workout logging interface",
      "Nutrition tracking with food database",
      "Progress charts and analytics",
      "Social features for motivation",
    ],
  },
  {
    date: "2024-12-10",
    title: "Banking Mobile App",
    description:
      "Design a secure and user-friendly mobile banking app. Include account overview, transaction history, money transfers, and bill payments. Security and trust should be paramount.",
    requirements: [
      "Account dashboard with balance overview",
      "Transaction history with search",
      "Money transfer interface",
      "Bill payment and scheduling",
    ],
  },
  {
    date: "2024-12-05",
    title: "E-commerce Product Page",
    description:
      "Create a product page for a sustainable fashion brand. The page should showcase eco-friendly clothing items with emphasis on sustainability features, materials, and brand story.",
    requirements: [
      "Product image gallery",
      "Sustainability badges and certifications",
      "Size guide integration",
      "Customer reviews section",
    ],
  },
]

// Function to get problem for any date
const getProblemForDate = (date: string) => {
  // First check if we have a specific problem for this date
  const specificProblem = DAILY_PROBLEMS.find((p) => p.date === date)
  if (specificProblem) return specificProblem

  // If not, generate a problem based on date
  const dateObj = new Date(date)
  const dayOfYear = Math.floor(
    (dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
  )
  const problemIndex = dayOfYear % DAILY_PROBLEMS.length

  return {
    ...DAILY_PROBLEMS[problemIndex],
    date: date, // Override the date to match the requested date
  }
}

export default function SubmitPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    file: null as File | null,
    filePreview: "",
  })
  const [todaysProblem, setTodaysProblem] = useState(DAILY_PROBLEMS[0])
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const problem = getProblemForDate(today)
    setTodaysProblem(problem)

    // Check if user has already submitted today
    const userSubmissions = JSON.parse(localStorage.getItem("userSubmissionHistory") || "{}")
    setHasSubmittedToday(userSubmissions[today] === true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (file: File) => {
    const filePreview = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, file, filePreview }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const today = new Date().toISOString().split("T")[0]

    // Save submission to localStorage
    const submission = {
      id: Date.now(),
      ...formData,
      problemId: todaysProblem.date,
      problemTitle: todaysProblem.title,
      submittedAt: new Date().toISOString(),
      filePreview: formData.filePreview,
    }

    // Get existing submissions
    const existingSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]")
    existingSubmissions.push(submission)
    localStorage.setItem("submissions", JSON.stringify(existingSubmissions))

    // Update user's submission history
    const userSubmissions = JSON.parse(localStorage.getItem("userSubmissionHistory") || "{}")
    userSubmissions[today] = true
    localStorage.setItem("userSubmissionHistory", JSON.stringify(userSubmissions))

    // Navigate to gallery with preview
    router.push("/gallery?preview=true")
  }

  if (hasSubmittedToday) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 rounded-xl shadow-md border-0">
              <div className="flex flex-col items-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-[#ecfdf5] flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-[#10b981]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Already Submitted Today!</h1>
                <p className="text-gray-600 leading-relaxed">
                  You've already submitted your solution for today's challenge. Come back tomorrow for a new challenge!
                </p>
                <div className="flex gap-4">
                  <Link href="/gallery">
                    <Button className="h-12 px-8 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 text-white rounded-full shadow-md">
                      View Gallery
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="h-12 px-8 border-[#d8b4fe] text-[#9333ea] hover:bg-[#f5f0ff] rounded-full"
                    >
                      Go Home
                    </Button>
                  </Link>
                </div>
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
            Today's Design Challenge
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section (Left) */}
            <div className="lg:col-span-8 space-y-6">
              <ProblemStatement problem={todaysProblem} />

              <Card className="p-6 rounded-xl shadow-md border-0">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Solution</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="rounded-lg border-gray-200 focus:border-[#d8b4fe] focus:ring-[#d8b4fe]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="rounded-lg border-gray-200 focus:border-[#d8b4fe] focus:ring-[#d8b4fe]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Solution Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your design approach, key decisions, and how you addressed the requirements..."
                      className="rounded-lg min-h-[120px] border-gray-200 focus:border-[#d8b4fe] focus:ring-[#d8b4fe]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Upload Design Solution</label>
                    <FileUploader onFileSelect={handleFileChange} />
                  </div>

                  {formData.filePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={formData.filePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 text-white rounded-full shadow-md"
                  >
                    Submit Solution
                  </Button>
                </form>
              </Card>
            </div>

            {/* Tips Section (Right) */}
            <div className="lg:col-span-4 space-y-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
