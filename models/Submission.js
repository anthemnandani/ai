// model/Submissions.ts
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  designTitle: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  problemId: { type: String, required: true },
  problemTitle: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Submission = mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);