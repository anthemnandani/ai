const { ObjectId } = require("mongodb")

class Validators {
  static isValidObjectId(id) {
    return ObjectId.isValid(id)
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static isValidDate(dateString) {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
  }

  static sanitizeString(str) {
    if (typeof str !== "string") return ""
    return str.trim().replace(/[<>]/g, "")
  }

  static validateSubmission(data) {
    const errors = []

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long")
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push("Valid email is required")
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long")
    }

    if (!data.problemId || data.problemId.trim().length === 0) {
      errors.push("Problem ID is required")
    }

    if (!data.problemTitle || data.problemTitle.trim().length === 0) {
      errors.push("Problem title is required")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateProblem(data) {
    const errors = []

    if (!data.date || !this.isValidDate(data.date)) {
      errors.push("Valid date is required")
    }

    if (!data.title || data.title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long")
    }

    if (!data.description || data.description.trim().length < 20) {
      errors.push("Description must be at least 20 characters long")
    }

    if (!data.requirements || !Array.isArray(data.requirements) || data.requirements.length === 0) {
      errors.push("At least one requirement is needed")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

module.exports = Validators
