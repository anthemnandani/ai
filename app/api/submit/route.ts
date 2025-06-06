import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";

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

    // Upload file to your storage solution here, e.g., Cloudinary, Supabase, etc.
    // For demo purposes, we'll mock this
    const imageUrl = "https://dummy-image-url.com/design.png";

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
    });

    return NextResponse.json({ message: "Submission saved!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving submission:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
