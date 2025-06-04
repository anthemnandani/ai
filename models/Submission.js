const { ObjectId } = require("mongodb")

class Submission {
  constructor(db) {
    this.collection = db.collection("submissions")
  }

  async create(submissionData) {
    const submission = {
      ...submissionData,
      submittedAt: new Date(),
    }

    const result = await this.collection.insertOne(submission)
    return { ...submission, _id: result.insertedId }
  }

  async findByProblemId(problemId) {
    return await this.collection.find({ problemId }).sort({ submittedAt: -1 }).toArray()
  }

  async findRecent(limit = 20) {
    return await this.collection.find({}).sort({ submittedAt: -1 }).limit(limit).toArray()
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid submission ID")
    }
    return await this.collection.findOne({ _id: new ObjectId(id) })
  }

  async findByEmail(email) {
    return await this.collection.find({ email: email.toLowerCase() }).sort({ submittedAt: -1 }).toArray()
  }

  async search(query, problemId = null) {
    const searchQuery = {}

    if (problemId) {
      searchQuery.problemId = problemId
    }

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { problemTitle: { $regex: query, $options: "i" } },
      ]
    }

    return await this.collection.find(searchQuery).sort({ submittedAt: -1 }).limit(50).toArray()
  }

  async getDistinctProblemIds() {
    const ids = await this.collection.distinct("problemId")
    return ids.sort().reverse()
  }

  async count(filter = {}) {
    return await this.collection.countDocuments(filter)
  }

  async countByProblemId(problemId) {
    return await this.collection.countDocuments({ problemId })
  }

  async countRecent(hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)
    return await this.collection.countDocuments({
      submittedAt: { $gte: since },
    })
  }

  async update(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid submission ID")
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    )

    return result.modifiedCount > 0
  }

  async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid submission ID")
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async getStats() {
    const pipeline = [
      {
        $group: {
          _id: "$problemId",
          count: { $sum: 1 },
          problemTitle: { $first: "$problemTitle" },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]

    return await this.collection.aggregate(pipeline).toArray()
  }
}

module.exports = Submission
