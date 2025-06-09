// app/api/submissions/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Submission } from "../../../models/Submission";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    if (!mongoose.connection.readyState) {
      console.log("Connecting to MongoDB via Mongoose...");
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "ai_challenge",
      });
      console.log("MongoDB connected");
    } else {
      console.log("MongoDB already connected");
    }
    const submissions = await Submission.find({}).sort({ createdAt: -1 }).lean();
    console.log(`Fetched ${submissions.length} submissions from MongoDB:`, JSON.stringify(submissions, null, 2));
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch submissions",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}