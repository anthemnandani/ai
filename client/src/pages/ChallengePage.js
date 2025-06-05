"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, Target, Palette, Lightbulb, ArrowRight, Clock, Users, Trophy } from "lucide-react"
import axios from "axios"

const ChallengePage = () => {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submissionCount, setSubmissionCount] = useState(0)

  useEffect(() => {
    fetchTodaysChallenge()
  }, [])

  const fetchTodaysChallenge = async () => {
    try {
      const response = await axios.get("/api/challenges/today")
      setChallenge(response.data)
      setSubmissionCount(response.data.submissionCount || 0)
    } catch (error) {
      console.error("Error fetching challenge:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Loading today's challenge...</p>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Target className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-2xl font-bold mb-2">No Challenge Available</h2>
          <p className="text-gray-600">Check back later for new challenges!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Today's Challenge
              </span>
            </h1>
            <p className="text-xl text-gray-600">Create AI-powered designs for real brands</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Challenge Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Challenge Overview */}
              <div className="card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{challenge.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(challenge.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {submissionCount} submissions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Brand: {challenge.brandName}</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{challenge.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Challenge Type:</h4>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                    {challenge.challengeType.replace("-", " ")}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Target Audience:</h4>
                  <p className="text-gray-700">{challenge.targetAudience}</p>
                </div>

                {challenge.keyWords && challenge.keyWords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Key Words:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.keyWords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {challenge.colorPalette && challenge.colorPalette.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Suggested Color Palette:</h4>
                    <div className="flex gap-2">
                      {challenge.colorPalette.map((color, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {challenge.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Prompt Suggestions */}
              {challenge.aiPromptSuggestions && challenge.aiPromptSuggestions.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" size={20} />
                    AI Prompt Suggestions
                  </h3>
                  <div className="space-y-3">
                    {challenge.aiPromptSuggestions.map((prompt, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 italic">"{prompt}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submit Button */}
              <div className="card text-center">
                <Palette className="mx-auto mb-4 text-purple-600" size={48} />
                <h3 className="text-xl font-bold mb-2">Ready to Create?</h3>
                <p className="text-gray-600 mb-6">
                  Use your favorite AI tools to create stunning designs for this challenge.
                </p>
                <Link to="/submit" className="btn btn-primary w-full">
                  Submit Your Design
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </div>

              {/* Challenge Stats */}
              <div className="card">
                <h4 className="font-bold mb-4">Challenge Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submissions:</span>
                    <span className="font-semibold">{submissionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Left:</span>
                    <span className="font-semibold text-orange-600">
                      <Clock size={16} className="inline mr-1" />
                      24 hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-semibold text-green-600">Intermediate</span>
                  </div>
                </div>
              </div>

              {/* AI Tools Suggestions */}
              <div className="card">
                <h4 className="font-bold mb-4">Recommended AI Tools</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Midjourney</div>
                    <div className="text-sm text-gray-600">Best for artistic designs</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">DALL-E 3</div>
                    <div className="text-sm text-gray-600">Great for detailed prompts</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Stable Diffusion</div>
                    <div className="text-sm text-gray-600">Free and customizable</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">Adobe Firefly</div>
                    <div className="text-sm text-gray-600">Commercial-safe designs</div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="card">
                <h4 className="font-bold mb-4">Pro Tips</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Read the requirements carefully</li>
                  <li>• Use the suggested keywords in your prompts</li>
                  <li>• Consider the target audience</li>
                  <li>• Iterate on your prompts for better results</li>
                  <li>• Include your process in the description</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ChallengePage
