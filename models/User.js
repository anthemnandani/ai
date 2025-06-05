const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Optional for guest users
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  socialLinks: {
    instagram: String,
    behance: String,
    dribbble: String,
    portfolio: String,
  },
  skills: [
    {
      type: String,
      enum: ["graphic-design", "ai-art", "branding", "illustration", "typography", "ui-ux", "photography"],
    },
  ],
  submissionCount: {
    type: Number,
    default: 0,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastSubmissionDate: {
    type: String, // YYYY-MM-DD format
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
