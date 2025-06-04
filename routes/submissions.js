const express = require("express")
const router = express.Router()
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")
const Submission = require("../models/Submission")

// Initialize Submission model with database
let submissionModel

const initializeModel = (db) => {
  submissionModel = new Submission(db)
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
})

// Submit solution
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, email, description, problemId, problemTitle } = req.body

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" })
    }

    if (!name || !email || !description || !problemId || !problemTitle) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "tutedude-submissions",
      transformation: [{ width: 1200, height: 675, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
    })

    // Remove local file
    fs.unlinkSync(req.file.path)

    const submissionData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      description: description.trim(),
      imageUrl: result.secure_url,
      problemId,
      problemTitle,
    }

    const submission = await submissionModel.create(submissionData)
    res.status(201).json(submission)
  } catch (error) {
    console.error("Error submitting solution:", error)

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ error: error.message })
  }
})

// Get submissions by problem date
router.get("/:problemId", async (req, res) => {
  try {
    const { problemId } = req.params
    const submissions = await submissionModel.findByProblemId(problemId)
    res.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get all submissions (recent)
router.get("/", async (req, res) => {
  try {
    const submissions = await submissionModel.findRecent(20)
    res.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get available submission dates
router.get("/dates/available", async (req, res) => {
  try {
    const dates = await submissionModel.getDistinctProblemIds()
    res.json(dates)
  } catch (error) {
    console.error("Error fetching available dates:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get single submission by ID
router.get("/single/:id", async (req, res) => {
  try {
    const { id } = req.params
    const submission = await submissionModel.findById(id)

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" })
    }

    res.json(submission)
  } catch (error) {
    console.error("Error fetching submission:", error)
    res.status(500).json({ error: error.message })
  }
})

// Search submissions
router.get("/search", async (req, res) => {
  try {
    const { q, problemId } = req.query
    const submissions = await submissionModel.search(q, problemId)
    res.json(submissions)
  } catch (error) {
    console.error("Error searching submissions:", error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = { router, initializeModel }
