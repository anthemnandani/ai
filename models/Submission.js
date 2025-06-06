import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema({
  name: String,
  email: String,
  designTitle: String,
  description: String,
  aiTool: String,
  imageUrl: String,
  problemId: String,
  problemTitle: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Submission = mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);