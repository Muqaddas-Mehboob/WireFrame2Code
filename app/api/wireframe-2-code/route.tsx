import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { wireframeRecords } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, userDescription, aiModel } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    const [record] = await db
      .insert(wireframeRecords)
      .values({
        imageUrl,
        userDescription,
        aiModel,
      })
      .returning();

    return NextResponse.json(record);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save record" },
      { status: 500 }
    );
  }
}