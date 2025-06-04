const { ObjectId } = require("mongodb")

class Problem {
  constructor(db) {
    this.collection = db.collection("problems")
  }

  async create(problemData) {
    const problem = {
      ...problemData,
      createdAt: new Date(),
    }

    const result = await this.collection.insertOne(problem)
    return { ...problem, _id: result.insertedId }
  }

  async findByDate(date) {
    return await this.collection.findOne({ date })
  }

  async findLatest() {
    return await this.collection.findOne({}, { sort: { date: -1 } })
  }

  async findAll() {
    return await this.collection.find({}).sort({ date: -1 }).toArray()
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid problem ID")
    }
    return await this.collection.findOne({ _id: new ObjectId(id) })
  }

  async update(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid problem ID")
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    )

    return result.modifiedCount > 0
  }

  async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid problem ID")
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async count() {
    return await this.collection.countDocuments()
  }
}

module.exports = Problem
