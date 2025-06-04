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

// Daily problem statements
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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const problem = DAILY_PROBLEMS.find((p) => p.date === today) || DAILY_PROBLEMS[0]
    setTodaysProblem(problem)
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

    // Save submission to localStorage (in real app, this would be a database)
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

    // Mark user as having submitted today
    localStorage.setItem("hasSubmittedToday", "true")
    localStorage.setItem("lastSubmissionDate", todaysProblem.date)

    // Navigate to gallery with preview
    router.push("/gallery?preview=true")
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

              <div className="hidden lg:block">
                <div className="relative h-80 w-full rounded-xl overflow-hidden bg-[#f5f0ff]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=320&width=320&text=TuteDude Mascot"
                      alt="TuteDude mascot illustration"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
