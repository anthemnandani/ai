const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const path = require("path")

// Import routes
const challengeRoutes = require("./routes/challenges")
const submissionRoutes = require("./routes/submissions")
const userRoutes = require("./routes/users")

dotenv.config()

const app = express()

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? ["https://your-domain.com"] : ["http://localhost:3000"],
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/challenges", challengeRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/users", userRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Serve static files from React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
