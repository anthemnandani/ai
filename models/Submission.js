const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Allow anonymous submissions
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  designTitle: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  aiToolsUsed: [
    {
      type: String,
      enum: ["midjourney", "dall-e", "stable-diffusion", "firefly", "canva-ai", "figma-ai", "other"],
    },
  ],
  aiPrompts: [
    {
      prompt: String,
      tool: String,
    },
  ],
  designImages: [
    {
      url: String,
      publicId: String, // Cloudinary public ID
      caption: String,
    },
  ],
  processImages: [
    {
      // Work-in-progress images
      url: String,
      publicId: String,
      caption: String,
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

// Indexes for better performance
submissionSchema.index({ challengeId: 1, submittedAt: -1 })
submissionSchema.index({ likes: -1 })
submissionSchema.index({ views: -1 })
submissionSchema.index({ featured: 1 })
submissionSchema.index({ email: 1 })

module.exports = mongoose.model("Submission", submissionSchema)
