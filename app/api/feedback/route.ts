import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

type FeedbackCategory = "feedback" | "feature";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { category, rating, message } = body;

    if (
      category !== "feedback" &&
      category !== "feature"
    ) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
      );
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;

    const db = client.db("latin-square");

    const feedback = {
      category: category as FeedbackCategory,
      rating,
      message: message.trim(),
      createdAt: new Date(),
    };

    await db.collection("feedback").insertOne(feedback);

    return NextResponse.json(
      { success: true },
      { status: 201 },
    );
  } catch (error) {
    console.error("Feedback submission error:", error);

    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 },
    );
  }
} 