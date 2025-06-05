"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/file-uploader"
import { ProblemStatement } from "@/components/problem-statement"
import { TipCard } from "@/components/tip-card"
import { RealtimeIndicator } from "@/components/realtime-indicator"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { storageUtils } from "@/lib/storage"
import { useRealtimeSubmissions } from "@/hooks/use-realtime-submissions"
import { toast } from "sonner"

export default function SubmitPage() {
  const router = useRouter()
  const { addSubmission } = useRealtimeSubmissions()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designTitle: "",
    description: "",
    aiTool: "",
    file: null as File | null,
  })

  const [todaysChallenge, setTodaysChallenge] = useState(storageUtils.getTodaysChallenge())
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setHasSubmittedToday(storageUtils.hasUserSubmittedToday())
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, aiTool: value }))
  }

  const handleFileChange = (file: File) => {
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file) {
      toast.error("Please upload a design file")
      return
    }

    setLoading(true)

    try {
      await addSubmission({
        name: formData.name,
        email: formData.email,
        designTitle: formData.designTitle,
        description: formData.description,
        imageFile: formData.file,
        problemId: todaysChallenge.date,
        problemTitle: todaysChallenge.title,
      })

      toast.success("Design submitted successfully!")
      router.push("/gallery?preview=true")
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Error submitting design. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (hasSubmittedToday) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8] py-12">
        <RealtimeIndicator />
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
      <RealtimeIndicator />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] bg-clip-text text-transparent">
            Today's Design Challenge
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section (Left) */}
            <div className="lg:col-span-8 space-y-6">
              <ProblemStatement problem={todaysChallenge} />

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
                    <label htmlFor="designTitle" className="text-sm font-medium text-gray-700">
                      Design Title
                    </label>
                    <Input
                      id="designTitle"
                      name="designTitle"
                      value={formData.designTitle}
                      onChange={handleInputChange}
                      placeholder="Give your design a catchy title"
                      className="rounded-lg border-gray-200 focus:border-[#d8b4fe] focus:ring-[#d8b4fe]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Design Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your design approach, AI prompts used, and key decisions..."
                      className="rounded-lg min-h-[120px] border-gray-200 focus:border-[#d8b4fe] focus:ring-[#d8b4fe]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">AI Tool Used</label>
                    <Select value={formData.aiTool} onValueChange={handleSelectChange} required>
                      <SelectTrigger className="rounded-lg border-gray-200 focus:border-[#d8b4fe] focus:ring-[#d8b4fe]">
                        <SelectValue placeholder="Select the AI tool you used" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midjourney">Midjourney</SelectItem>
                        <SelectItem value="dall-e">DALL-E 3</SelectItem>
                        <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                        <SelectItem value="firefly">Adobe Firefly</SelectItem>
                        <SelectItem value="canva-ai">Canva AI</SelectItem>
                        <SelectItem value="leonardo">Leonardo AI</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Upload Design</label>
                    <FileUploader onFileSelect={handleFileChange} />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 text-white rounded-full shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Design"
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Tips Section (Right) */}
            <div className="lg:col-span-4 space-y-6">
              <TipCard
                title="Submission Tips"
                tips={[
                  "Address all requirements in the brief",
                  "Explain your AI prompts and iterations",
                  "Use high-quality images (PNG or JPG)",
                  "Consider brand consistency and target audience",
                  "Show your creative process and thinking",
                  "Be specific about your design decisions",
                ]}
              />

              <TipCard
                title="AI Tool Recommendations"
                tips={[
                  "Midjourney: Best for artistic and creative designs",
                  "DALL-E 3: Great for detailed, specific prompts",
                  "Stable Diffusion: Free and highly customizable",
                  "Adobe Firefly: Commercial-safe, integrated workflow",
                  "Canva AI: User-friendly with templates",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
