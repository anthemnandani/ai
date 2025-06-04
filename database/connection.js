const { MongoClient } = require("mongodb")

class Database {
  constructor() {
    this.client = null
    this.db = null
  }

  async connect(uri) {
    try {
      this.client = new MongoClient(uri)
      await this.client.connect()
      this.db = this.client.db()

      console.log("Connected to MongoDB")

      // Create indexes for better performance
      await this.createIndexes()

      return this.db
    } catch (error) {
      console.error("MongoDB connection error:", error)
      throw error
    }
  }

  async createIndexes() {
    try {
      // Problems collection indexes
      await this.db.collection("problems").createIndex({ date: 1 }, { unique: true })

      // Submissions collection indexes
      await this.db.collection("submissions").createIndex({ problemId: 1 })
      await this.db.collection("submissions").createIndex({ submittedAt: -1 })
      await this.db.collection("submissions").createIndex({ email: 1 })

      // Text search index for submissions
      await this.db.collection("submissions").createIndex({
        name: "text",
        description: "text",
        problemTitle: "text",
      })

      console.log("Database indexes created")
    } catch (error) {
      console.error("Error creating indexes:", error)
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error("Database not connected")
    }
    return this.db
  }

  async close() {
    if (this.client) {
      await this.client.close()
      console.log("Database connection closed")
    }
  }
}

module.exports = new Database()
