const express = require("express")
const router = express.Router()
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const Submission = require("../models/Submission")
const Challenge = require("../models/Challenge")

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, folder = "ai-design-submissions") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folder,
          transformation: [{ width: 1200, height: 1200, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
      .end(buffer)
  })
}

// Submit new design
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { challengeId, name, email, designTitle, description, aiToolsUsed, aiPrompts, tags } = req.body

    // Validate required fields
    if (!challengeId || !name || !email || !designTitle || !description) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" })
    }

    // Verify challenge exists
    const challenge = await Challenge.findById(challengeId)
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer))
    const uploadResults = await Promise.all(uploadPromises)

    const designImages = uploadResults.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      caption: `Design ${index + 1}`,
    }))

    // Parse JSON fields
    const parsedAiToolsUsed = aiToolsUsed ? JSON.parse(aiToolsUsed) : []
    const parsedAiPrompts = aiPrompts ? JSON.parse(aiPrompts) : []
    const parsedTags = tags ? JSON.parse(tags) : []

    const submission = new Submission({
      challengeId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      designTitle: designTitle.trim(),
      description: description.trim(),
      aiToolsUsed: parsedAiToolsUsed,
      aiPrompts: parsedAiPrompts,
      designImages,
      tags: parsedTags,
    })

    await submission.save()

    // Update challenge submission count
    await Challenge.findByIdAndUpdate(challengeId, { $inc: { submissionCount: 1 } })

    // Populate challenge data for response
    await submission.populate("challengeId", "title brandName")

    res.status(201).json(submission)
  } catch (error) {
    console.error("Error creating submission:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get submissions for a specific challenge
router.get("/challenge/:challengeId", async (req, res) => {
  try {
    const { challengeId } = req.params
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const sort = req.query.sort || "recent" // recent, popular, featured
    const skip = (page - 1) * limit

    let sortQuery = { submittedAt: -1 } // Default: most recent

    switch (sort) {
      case "popular":
        sortQuery = { likes: -1, submittedAt: -1 }
        break
      case "featured":
        sortQuery = { featured: -1, likes: -1, submittedAt: -1 }
        break
      case "views":
        sortQuery = { views: -1, submittedAt: -1 }
        break
    }

    const submissions = await Submission.find({ challengeId })
      .populate("challengeId", "title brandName challengeType")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)

    const total = await Submission.countDocuments({ challengeId })

    res.json({
      submissions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all submissions (with filters)
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const sort = req.query.sort || "recent"
    const challengeType = req.query.challengeType
    const skip = (page - 1) * limit

    let sortQuery = { submittedAt: -1 }
    const filterQuery = {}

    // Apply sorting
    switch (sort) {
      case "popular":
        sortQuery = { likes: -1, submittedAt: -1 }
        break
      case "featured":
        sortQuery = { featured: -1, likes: -1, submittedAt: -1 }
        break
      case "views":
        sortQuery = { views: -1, submittedAt: -1 }
        break
    }

    // Build aggregation pipeline for filtering by challenge type
    const pipeline = [
      {
        $lookup: {
          from: "challenges",
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge",
        },
      },
      { $unwind: "$challenge" },
    ]

    if (challengeType) {
      pipeline.push({
        $match: { "challenge.challengeType": challengeType },
      })
    }

    pipeline.push({ $sort: sortQuery }, { $skip: skip }, { $limit: limit })

    const submissions = await Submission.aggregate(pipeline)

    // Get total count for pagination
    const countPipeline = [
      {
        $lookup: {
          from: "challenges",
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge",
        },
      },
      { $unwind: "$challenge" },
    ]

    if (challengeType) {
      countPipeline.push({
        $match: { "challenge.challengeType": challengeType },
      })
    }

    countPipeline.push({ $count: "total" })

    const countResult = await Submission.aggregate(countPipeline)
    const total = countResult[0]?.total || 0

    res.json({
      submissions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single submission by ID
router.get("/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate(
      "challengeId",
      "title brandName challengeType description requirements",
    )

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" })
    }

    // Increment view count
    await Submission.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

    res.json(submission)
  } catch (error) {
    console.error("Error fetching submission:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Like/Unlike submission
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body // Optional: for tracking user likes
    const submissionId = req.params.id

    const submission = await Submission.findById(submissionId)
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" })
    }

    // Simple like increment (can be enhanced with user tracking)
    await Submission.findByIdAndUpdate(submissionId, { $inc: { likes: 1 } })

    res.json({ message: "Submission liked successfully" })
  } catch (error) {
    console.error("Error liking submission:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Search submissions
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    const searchRegex = new RegExp(query, "i")

    const submissions = await Submission.find({
      $or: [
        { designTitle: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
        { name: searchRegex },
      ],
    })
      .populate("challengeId", "title brandName")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Submission.countDocuments({
      $or: [
        { designTitle: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
        { name: searchRegex },
      ],
    })

    res.json({
      submissions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Error searching submissions:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
