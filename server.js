const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")
const cors = require("cors")
const dotenv = require("dotenv")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const path = require("path")
const fs = require("fs")

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
let db
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/tutedude-challenges"

MongoClient.connect(mongoUri)
  .then((client) => {
    console.log("Connected to MongoDB")
    db = client.db()

    // Create indexes for better performance
    db.collection("problems").createIndex({ date: 1 }, { unique: true })
    db.collection("submissions").createIndex({ problemId: 1 })
    db.collection("submissions").createIndex({ submittedAt: -1 })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const dir = "./uploads"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
})

// Seed initial problems
const seedProblems = async () => {
  try {
    const problemsCollection = db.collection("problems")
    const count = await problemsCollection.countDocuments()

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
          createdAt: new Date(),
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
          createdAt: new Date(),
        },
      ]

      await problemsCollection.insertMany(problems)
      console.log("Initial problems seeded")
    }
  } catch (error) {
    console.error("Error seeding problems:", error)
  }
}

// Database helper functions
const getProblemsCollection = () => db.collection("problems")
const getSubmissionsCollection = () => db.collection("submissions")

// Routes

// Get today's problem
app.get("/api/problems/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]
    const problemsCollection = getProblemsCollection()

    let problem = await problemsCollection.findOne({ date: today })

    if (!problem) {
      // If no problem for today, get the latest one
      problem = await problemsCollection.findOne({}, { sort: { date: -1 } })
    }

    res.json(problem)
  } catch (error) {
    console.error("Error fetching today's problem:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get all problems
app.get("/api/problems", async (req, res) => {
  try {
    const problemsCollection = getProblemsCollection()
    const problems = await problemsCollection.find({}).sort({ date: -1 }).toArray()
    res.json(problems)
  } catch (error) {
    console.error("Error fetching problems:", error)
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

    // Validate required fields
    if (!name || !email || !description || !problemId || !problemTitle) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "tutedude-submissions",
      transformation: [{ width: 1200, height: 675, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
    })

    // Remove the file from local storage after upload to Cloudinary
    fs.unlinkSync(req.file.path)

    const submission = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      description: description.trim(),
      imageUrl: result.secure_url,
      problemId,
      problemTitle,
      submittedAt: new Date(),
    }

    const submissionsCollection = getSubmissionsCollection()
    const insertResult = await submissionsCollection.insertOne(submission)

    // Return the created submission with the generated _id
    const createdSubmission = { ...submission, _id: insertResult.insertedId }

    res.status(201).json(createdSubmission)
  } catch (error) {
    console.error("Error submitting solution:", error)

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ error: error.message })
  }
})

// Get submissions by problem date
app.get("/api/submissions/:problemId", async (req, res) => {
  try {
    const { problemId } = req.params
    const submissionsCollection = getSubmissionsCollection()

    const submissions = await submissionsCollection.find({ problemId }).sort({ submittedAt: -1 }).toArray()

    res.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get all submissions (recent)
app.get("/api/submissions", async (req, res) => {
  try {
    const submissionsCollection = getSubmissionsCollection()
    const submissions = await submissionsCollection.find({}).sort({ submittedAt: -1 }).limit(20).toArray()

    res.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get available submission dates
app.get("/api/submissions/dates/available", async (req, res) => {
  try {
    const submissionsCollection = getSubmissionsCollection()
    const dates = await submissionsCollection.distinct("problemId")

    // Sort dates in descending order
    const sortedDates = dates.sort().reverse()
    res.json(sortedDates)
  } catch (error) {
    console.error("Error fetching available dates:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get submission by ID
app.get("/api/submissions/single/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid submission ID" })
    }

    const submissionsCollection = getSubmissionsCollection()
    const submission = await submissionsCollection.findOne({ _id: new ObjectId(id) })

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" })
    }

    res.json(submission)
  } catch (error) {
    console.error("Error fetching submission:", error)
    res.status(500).json({ error: error.message })
  }
})

// Admin route to view all data
app.get("/api/admin/data", async (req, res) => {
  try {
    const submissionsCollection = getSubmissionsCollection()
    const problemsCollection = getProblemsCollection()

    const [submissions, problems] = await Promise.all([
      submissionsCollection.find({}).sort({ submittedAt: -1 }).toArray(),
      problemsCollection.find({}).sort({ date: -1 }).toArray(),
    ])

    res.json({
      submissions,
      problems,
      databaseInfo: {
        name: db.databaseName,
        collections: await db.listCollections().toArray(),
        connectionString: mongoUri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"), // Hide credentials
      },
    })
  } catch (error) {
    console.error("Error fetching admin data:", error)
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 10MB." })
    }
  }

  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({ error: "Only image files are allowed!" })
  }

  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
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
  console.log(`Admin dashboard available at: http://localhost:${PORT}/api/admin/data`)

  // Wait a bit for MongoDB connection to be established
  setTimeout(async () => {
    if (db) {
      await seedProblems()
    }
  }, 1000)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...")
  process.exit(0)
})
