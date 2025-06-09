// database/connection.ts
import { MongoClient } from "mongodb";

class Database {
  private client: MongoClient | null = null;
  private db: any = null;

  async connect(uri: string | undefined) {
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }
    try {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db();
      console.log("Connected to MongoDB");
      await this.createIndexes();
      return this.db;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      await this.db.collection("problems").createIndex({ date: 1 }, { unique: true });
      await this.db.collection("submissions").createIndex({ problemId: 1 });
      await this.db.collection("submissions").createIndex({ submittedAt: -1 });
      await this.db.collection("submissions").createIndex({ email: 1 });
      await this.db.collection("submissions").createIndex({
        name: "text",
        description: "text",
        problemTitle: "text",
      });
      console.log("Database indexes created");
    } catch (error) {
      console.error("Error creating indexes:", error);
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log("Database connection closed");
    }
  }
}

export default new Database();