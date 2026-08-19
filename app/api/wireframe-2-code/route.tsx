import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
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

export async function GET(req: NextRequest) {
  try {
    const reqUrl = new URL(req.url);
    const recordId = reqUrl.searchParams.get("recordId");

    if (!recordId) {
      return NextResponse.json(
        { error: "recordId is required" },
        { status: 400 }
      );
    }

    const [record] = await db
      .select()
      .from(wireframeRecords)
      .where(eq(wireframeRecords.id, recordId));

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}