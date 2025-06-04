"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Define the shape of our shared data
interface SharedData {
  submissions: any[]
  addSubmission: (submission: any) => void
}

// Create the context
const SharedDataContext = createContext<SharedData | undefined>(undefined)

// Demo submissions that will be visible to all users
const DEMO_SUBMISSIONS = [
  {
    id: 1001,
    name: "Alex Johnson",
    email: "alex@example.com",
    description:
      "I focused on creating a clean, intuitive interface with clear visual hierarchy. Used a soft color palette to create a calming effect and added subtle animations for better user engagement.",
    filePreview: "/placeholder.svg?height=600&width=800",
    problemId: "2024-12-06",
    problemTitle: "Smart Home Dashboard",
    submittedAt: "2024-12-06T14:30:00Z",
  },
  {
    id: 1002,
    name: "Jamie Smith",
    email: "jamie@example.com",
    description:
      "My approach was to create a minimalist design that focuses on the most important information. I used cards for each device category and implemented a simple toggle system for controls.",
    filePreview: "/placeholder.svg?height=600&width=800",
    problemId: "2024-12-06",
    problemTitle: "Smart Home Dashboard",
    submittedAt: "2024-12-06T16:45:00Z",
  },
  {
    id: 1003,
    name: "Taylor Wong",
    email: "taylor@example.com",
    description:
      "I designed this product page to highlight the sustainable aspects of each item. The materials section uses icons to quickly communicate eco-friendliness, and customer reviews are prominently featured.",
    filePreview: "/placeholder.svg?height=600&width=800",
    problemId: "2024-12-05",
    problemTitle: "E-commerce Product Page",
    submittedAt: "2024-12-05T10:15:00Z",
  },
  {
    id: 1004,
    name: "Morgan Lee",
    email: "morgan@example.com",
    description:
      "For this food delivery app, I focused on making the food images the star. Large cards with minimal text interference allow users to visually browse options quickly.",
    filePreview: "/placeholder.svg?height=600&width=800",
    problemId: "2024-12-07",
    problemTitle: "Food Delivery Mobile App",
    submittedAt: "2024-12-07T09:20:00Z",
  },
  {
    id: 1005,
    name: "Casey Rivera",
    email: "casey@example.com",
    description:
      "My e-learning platform design focuses on progress tracking and engagement. I used gamification elements to keep students motivated and a clean video interface with note-taking capabilities.",
    filePreview: "/placeholder.svg?height=600&width=800",
    problemId: "2024-12-08",
    problemTitle: "Online Learning Platform",
    submittedAt: "2024-12-08T11:30:00Z",
  },
]

// Provider component
export function SharedDataProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<any[]>([])

  // Load submissions from localStorage and combine with demo submissions on mount
  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]")

    // Combine user submissions with demo submissions
    const allSubmissions = [...storedSubmissions, ...DEMO_SUBMISSIONS]

    // Remove duplicates by ID
    const uniqueSubmissions = allSubmissions.filter(
      (submission, index, self) => index === self.findIndex((s) => s.id === submission.id),
    )

    setSubmissions(uniqueSubmissions)
  }, [])

  // Function to add a new submission
  const addSubmission = (submission: any) => {
    setSubmissions((prev) => {
      const newSubmissions = [...prev, submission]

      // Store only user submissions in localStorage (not demo ones)
      const userSubmissions = newSubmissions.filter((s) => !DEMO_SUBMISSIONS.some((demo) => demo.id === s.id))
      localStorage.setItem("submissions", JSON.stringify(userSubmissions))

      return newSubmissions
    })
  }

  return <SharedDataContext.Provider value={{ submissions, addSubmission }}>{children}</SharedDataContext.Provider>
}

// Custom hook to use the shared data
export function useSharedData() {
  const context = useContext(SharedDataContext)
  if (context === undefined) {
    throw new Error("useSharedData must be used within a SharedDataProvider")
  }
  return context
}
