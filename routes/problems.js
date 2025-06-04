const express = require("express")
const router = express.Router()
const Problem = require("../models/Problem")

// Initialize Problem model with database
let problemModel

const initializeModel = (db) => {
  problemModel = new Problem(db)
}

// Get today's problem
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]
    let problem = await problemModel.findByDate(today)

    if (!problem) {
      // If no problem for today, get the latest one
      problem = await problemModel.findLatest()
    }

    res.json(problem)
  } catch (error) {
    console.error("Error fetching today's problem:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get all problems
router.get("/", async (req, res) => {
  try {
    const problems = await problemModel.findAll()
    res.json(problems)
  } catch (error) {
    console.error("Error fetching problems:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get problem by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const problem = await problemModel.findById(id)

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" })
    }

    res.json(problem)
  } catch (error) {
    console.error("Error fetching problem:", error)
    res.status(500).json({ error: error.message })
  }
})

// Create new problem (admin only)
router.post("/", async (req, res) => {
  try {
    const { date, title, description, requirements } = req.body

    if (!date || !title || !description || !requirements) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const problemData = {
      date,
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.map((req) => req.trim()),
    }

    const problem = await problemModel.create(problemData)
    res.status(201).json(problem)
  } catch (error) {
    console.error("Error creating problem:", error)
    if (error.code === 11000) {
      res.status(400).json({ error: "A problem already exists for this date" })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

module.exports = { router, initializeModel }
