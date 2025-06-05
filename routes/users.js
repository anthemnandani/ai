const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Submission = require("../models/Submission")

// Get user profile by email (for guest users)
router.get("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params

    // Get user submissions
    const submissions = await Submission.find({ email: email.toLowerCase() })
      .populate("challengeId", "title brandName challengeType")
      .sort({ submittedAt: -1 })

    // Calculate stats
    const totalSubmissions = submissions.length
    const totalLikes = submissions.reduce((sum, sub) => sum + sub.likes, 0)
    const totalViews = submissions.reduce((sum, sub) => sum + sub.views, 0)

    // Get unique challenge types participated in
    const challengeTypes = [...new Set(submissions.map((sub) => sub.challengeId.challengeType))]

    res.json({
      email,
      submissions,
      stats: {
        totalSubmissions,
        totalLikes,
        totalViews,
        challengeTypes,
      },
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const period = req.query.period || "all" // all, month, week
    let dateFilter = {}

    if (period === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateFilter = { submittedAt: { $gte: monthAgo } }
    } else if (period === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = { submittedAt: { $gte: weekAgo } }
    }

    const leaderboard = await Submission.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$email",
          name: { $first: "$name" },
          totalSubmissions: { $sum: 1 },
          totalLikes: { $sum: "$likes" },
          totalViews: { $sum: "$views" },
          avgLikes: { $avg: "$likes" },
          lastSubmission: { $max: "$submittedAt" },
        },
      },
      { $sort: { totalLikes: -1, totalSubmissions: -1 } },
      { $limit: 50 },
    ])

    res.json(leaderboard)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
