const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const path = require("path")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "demo",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo",
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tutedude-challenges", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Problem Schema
const problemSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  createdAt: { type: Date, default: Date.now },
})

// Submission Schema
const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  problemId: { type: String, required: true },
  problemTitle: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
})

const Problem = mongoose.model("Problem", problemSchema)
const Submission = mongoose.model("Submission", submissionSchema)

// Multer configuration for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// Seed initial problems
const seedProblems = async () => {
  try {
    const count = await Problem.countDocuments()
    if (count === 0) {
      const problems = [
        {
          date: "2024-12-06",
          title: "Smart Home Dashboard",
          description:
            "Design a minimalist dashboard interface for a smart home app. The dashboard should display key metrics like temperature, energy usage, security status, and quick controls for lights and appliances. Focus on clean typography, intuitive icons, and a calming color palette.",
          requirements: [
            "Include at least 4 different widget types",
            "Use a grid-based layout",
            "Implement dark/light mode considerations",
            "Show real-time data visualization",
          ],
        },
        {
          date: "2024-12-05",
          title: "E-commerce Product Page",
          description:
            "Create a product page for a sustainable fashion brand. The page should showcase eco-friendly clothing items with emphasis on sustainability features, materials, and brand story.",
          requirements: [
            "Product image gallery",
            "Sustainability badges and certifications",
            "Size guide integration",
            "Customer reviews section",
          ],
        },
      ]
      await Problem.insertMany(problems)
      console.log("Initial problems seeded")
    }
  } catch (error) {
    console.error("Error seeding problems:", error)
  }
}

// Routes

// Get today's problem
app.get("/api/problems/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]
    let problem = await Problem.findOne({ date: today })

    if (!problem) {
      // If no problem for today, get the latest one
      problem = await Problem.findOne().sort({ date: -1 })
    }

    res.json(problem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all problems
app.get("/api/problems", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ date: -1 })
    res.json(problems)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Submit solution
app.post("/api/submissions", upload.single("image"), async (req, res) => {
  try {
    const { name, email, description, problemId, problemTitle } = req.body

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" })
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", folder: "tutedude-submissions" }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(req.file.buffer)
    })

    const submission = new Submission({
      name,
      email,
      description,
      imageUrl: result.secure_url,
      problemId,
      problemTitle,
    })

    await submission.save()
    res.status(201).json(submission)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get submissions by problem date
app.get("/api/submissions/:problemId", async (req, res) => {
  try {
    const { problemId } = req.params
    const submissions = await Submission.find({ problemId }).sort({ submittedAt: -1 })
    res.json(submissions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all submissions (recent)
app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 }).limit(20)
    res.json(submissions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get available submission dates
app.get("/api/submissions/dates/available", async (req, res) => {
  try {
    const dates = await Submission.distinct("problemId")
    res.json(dates.sort().reverse())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Serve static files from React build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await seedProblems()
})
