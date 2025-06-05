const mongoose = require("mongoose")

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
    trim: true,
  },
  brandLogo: {
    type: String, // URL to brand logo
    required: false,
  },
  challengeType: {
    type: String,
    enum: ["rebranding", "advertisement", "social-media", "packaging", "logo-design"],
    required: true,
  },
  targetAudience: {
    type: String,
    required: true,
  },
  keyWords: [
    {
      type: String,
      trim: true,
    },
  ],
  colorPalette: [
    {
      type: String, // Hex color codes
      trim: true,
    },
  ],
  inspirationImages: [
    {
      type: String, // URLs to inspiration images
    },
  ],
  requirements: [
    {
      type: String,
      required: true,
    },
  ],
  aiPromptSuggestions: [
    {
      type: String,
    },
  ],
  date: {
    type: String,
    required: true,
    unique: true, // Ensure one challenge per day
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  submissionCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for better query performance
challengeSchema.index({ date: -1 })
challengeSchema.index({ isActive: 1 })
challengeSchema.index({ challengeType: 1 })

module.exports = mongoose.model("Challenge", challengeSchema)
