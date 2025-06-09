// app/api/submit/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const body = await req.formData();

    const file = body.get("file") as File;
    const name = body.get("name") as string;
    const email = body.get("email") as string;
    const designTitle = body.get("designTitle") as string;
    const description = body.get("description") as string;
    const aiTool = body.get("aiTool") as string;
    const problemId = body.get("problemId") as string;
    const problemTitle = body.get("problemTitle") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ai-challenge-submissions",
          public_id: `${problemId}_${Date.now()}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed"));
        }
      );
      stream.end(buffer);
    });

    const imageUrl = uploadResult.secure_url;

    await connectToDatabase();

    await Submission.create({
      name,
      email,
      designTitle,
      description,
      aiTool,
      imageUrl,
      problemId,
      problemTitle,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Submission saved!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving submission:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}