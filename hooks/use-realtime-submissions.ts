"use client"

import { useState, useEffect } from "react"
import { storageUtils, realtimeStorage, type Submission } from "@/lib/storage"

export function useRealtimeSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load initial submissions
    const initialSubmissions = storageUtils.getSubmissions()
    setSubmissions(initialSubmissions)
    setLoading(false)

    // Subscribe to real-time updates
    const unsubscribe = realtimeStorage.subscribe("new_submission", (data: string) => {
      try {
        const newSubmission = JSON.parse(data)
        setSubmissions((prev) => {
          // Check if submission already exists to avoid duplicates
          if (prev.some((s) => s.id === newSubmission.id)) {
            return prev
          }
          return [newSubmission, ...prev]
        })
      } catch (error) {
        console.error("Error parsing new submission:", error)
      }
    })

    return unsubscribe
  }, [])

  const addSubmission = async (submissionData: {
    name: string
    email: string
    designTitle: string
    description: string
    imageFile: File
    problemId: string
    problemTitle: string
  }) => {
    try {
      // Convert image to base64
      const imageUrl = await storageUtils.convertFileToBase64(submissionData.imageFile)

      // Add submission to storage
      const newSubmission = storageUtils.addSubmission({
        name: submissionData.name,
        email: submissionData.email,
        designTitle: submissionData.designTitle,
        description: submissionData.description,
        imageUrl,
        problemId: submissionData.problemId,
        problemTitle: submissionData.problemTitle,
      })

      // Mark user as submitted for today
      storageUtils.markUserSubmitted(submissionData.problemId)

      return newSubmission
    } catch (error) {
      console.error("Error adding submission:", error)
      throw error
    }
  }

  return {
    submissions,
    loading,
    addSubmission,
  }
}
