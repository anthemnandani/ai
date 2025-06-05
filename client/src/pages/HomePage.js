"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Palette,
  Sparkles,
  Trophy,
  ArrowRight,
  Brain,
  Zap,
  Target,
  GalleryThumbnailsIcon as Gallery,
} from "lucide-react"
import axios from "axios"

const HomePage = () => {
  const [todaysChallenge, setTodaysChallenge] = useState(null)
  const [recentSubmissions, setRecentSubmissions] = useState([])
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    activeDesigners: 0,
    challengesCompleted: 0,
  })
  const [challenge, setChallenge] = useState(null)

  useEffect(() => {
    fetchTodaysChallenge()
    fetchRecentSubmissions()
    fetchStats()
  }, [])

  const fetchTodaysChallenge = async () => {
    try {
      const response = await axios.get("/api/challenges/today")
      setTodaysChallenge(response.data)
    } catch (error) {
      console.error("Error fetching today's challenge:", error)
    }
  }

  const fetchRecentSubmissions = async () => {
    try {
      const response = await axios.get("/api/submissions?limit=6&sort=recent")
      setRecentSubmissions(response.data.submissions)
    } catch (error) {
      console.error("Error fetching recent submissions:", error)
    }
  }

  const fetchStats = async () => {
    try {
      // This would be a real API call in production
      setStats({
        totalSubmissions: 1247,
        activeDesigners: 89,
        challengesCompleted: 45,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section className="hero-section py-20" initial="hidden" animate="visible" variants={containerVariants}>
        <div className="container text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                AI Design Arena
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              Create stunning AI-powered graphics for real brands. Compete daily, showcase your creativity, and win
              recognition in the ultimate design challenge.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/challenge" className="btn btn-primary text-lg px-8 py-4">
              <Palette className="mr-2" size={20} />
              Start Today's Challenge
            </Link>
            <Link to="/gallery" className="btn btn-secondary text-lg px-8 py-4">
              <Gallery className="mr-2" size={20} />
              Explore Gallery
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalSubmissions}+</div>
              <div className="text-gray-600">AI Designs Created</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{stats.activeDesigners}+</div>
              <div className="text-gray-600">Active Designers</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.challengesCompleted}+</div>
              <div className="text-gray-600">Challenges Completed</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Today's Challenge Preview */}
      {todaysChallenge && (
        <motion.section
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Today's Challenge</h2>
              <p className="text-xl text-gray-600">Create AI-powered designs for real brands</p>
            </motion.div>

            <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
              <div className="card card-gradient p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{todaysChallenge.title}</h3>
                    <p className="text-purple-600 font-semibold">Brand: {todaysChallenge.brandName}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{todaysChallenge.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {todaysChallenge.keyWords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Link to="/challenge" className="btn btn-primary text-lg px-8 py-3">
                    View Full Challenge
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* How It Works */}
      <motion.section
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to showcase your AI design skills</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Brain className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">1. Get Daily Challenge</h3>
              <p className="text-gray-600">
                Receive a new brand design challenge every day with specific requirements and creative briefs.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">2. Create with AI</h3>
              <p className="text-gray-600">
                Use AI tools like Midjourney, DALL-E, or Stable Diffusion to create stunning designs.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">3. Share & Compete</h3>
              <p className="text-gray-600">
                Submit your designs, get feedback from the community, and climb the leaderboard.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Recent Submissions */}
      {recentSubmissions.length > 0 && (
        <motion.section
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="container">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Submissions</h2>
              <p className="text-xl text-gray-600">See what the community is creating</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentSubmissions.map((submission, index) => (
                <motion.div key={submission._id} variants={itemVariants} className="gallery-card">
                  <Link to={`/submission/${submission._id}`}>
                    <img
                      src={submission.designImages[0]?.url || "/placeholder.svg"}
                      alt={submission.designTitle}
                      className="gallery-image"
                    />
                    <div className="gallery-overlay">
                      <h3 className="font-bold text-lg mb-2">{submission.designTitle}</h3>
                      <p className="text-sm opacity-90 mb-2">by {submission.name}</p>
                      <p className="text-xs opacity-75">{submission.challenge?.brandName}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="text-center mt-8">
              <Link to="/gallery" className="btn btn-outline">
                View All Submissions
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container">
          <motion.div variants={itemVariants} className="card card-gradient text-center p-12">
            <Sparkles className="mx-auto mb-6 text-purple-600" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Amazing AI Designs?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of designers creating stunning AI-powered graphics for real brands. Start your creative
              journey today!
            </p>
            <Link to="/challenge" className="btn btn-primary text-lg px-8 py-4">
              <Palette className="mr-2" size={20} />
              Start Creating Now
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage
