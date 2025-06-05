const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { Server } = require("socket.io")
const http = require("http")
const path = require("path")

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Submission Schema
const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  designTitle: { type: String, required: true },
  description: { type: String, required: true },
  brandName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  aiTool: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
})

const Submission = mongoose.model("Submission", submissionSchema)

// Challenge Schema
const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brandName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

const Challenge = mongoose.model("Challenge", challengeSchema)

// Multer configuration
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files allowed"), false)
    }
  },
})

// Upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "ai-design-submissions" }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
      .end(buffer)
  })
}

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Routes

// Get today's challenge
app.get("/api/challenge/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]
    let challenge = await Challenge.findOne({ date: today, isActive: true })

    if (!challenge) {
      challenge = await Challenge.findOne({ isActive: true }).sort({ date: -1 })
    }

    res.json(challenge)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Submit design
app.post("/api/submissions", upload.single("image"), async (req, res) => {
  try {
    const { name, email, designTitle, description, brandName, aiTool } = req.body

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" })
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer)

    // Save to database
    const submission = new Submission({
      name,
      email,
      designTitle,
      description,
      brandName,
      aiTool,
      imageUrl: result.secure_url,
    })

    await submission.save()

    // Emit real-time update to all connected clients
    io.emit("newSubmission", submission)

    res.status(201).json(submission)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all submissions
app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 })
    res.json(submissions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create challenge (for admin)
app.post("/api/challenges", async (req, res) => {
  try {
    const challenge = new Challenge(req.body)
    await challenge.save()
    res.status(201).json(challenge)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
