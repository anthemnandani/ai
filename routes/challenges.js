const express = require("express")
const router = express.Router()
const Challenge = require("../models/Challenge")
const Submission = require("../models/Submission")

// Get today's challenge
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]

    let challenge = await Challenge.findOne({
      date: today,
      isActive: true,
    })

    if (!challenge) {
      // Get the latest challenge if no challenge for today
      challenge = await Challenge.findOne({ isActive: true }).sort({ date: -1 })
    }

    if (!challenge) {
      return res.status(404).json({ message: "No active challenges found" })
    }

    res.json(challenge)
  } catch (error) {
    console.error("Error fetching today's challenge:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all challenges (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const challenges = await Challenge.find({ isActive: true }).sort({ date: -1 }).skip(skip).limit(limit)

    const total = await Challenge.countDocuments({ isActive: true })

    res.json({
      challenges,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Error fetching challenges:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get challenge by ID
router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    res.json(challenge)
  } catch (error) {
    console.error("Error fetching challenge:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new challenge (Admin only)
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      brandName,
      brandLogo,
      challengeType,
      targetAudience,
      keyWords,
      colorPalette,
      inspirationImages,
      requirements,
      aiPromptSuggestions,
      date,
    } = req.body

    // Validate required fields
    if (!title || !description || !brandName || !challengeType || !targetAudience || !requirements || !date) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const challenge = new Challenge({
      title,
      description,
      brandName,
      brandLogo,
      challengeType,
      targetAudience,
      keyWords: keyWords || [],
      colorPalette: colorPalette || [],
      inspirationImages: inspirationImages || [],
      requirements,
      aiPromptSuggestions: aiPromptSuggestions || [],
      date,
    })

    await challenge.save()
    res.status(201).json(challenge)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Challenge already exists for this date" })
    }
    console.error("Error creating challenge:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update challenge submission count
router.patch("/:id/increment-submissions", async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, { $inc: { submissionCount: 1 } }, { new: true })

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    res.json({ submissionCount: challenge.submissionCount })
  } catch (error) {
    console.error("Error updating submission count:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
