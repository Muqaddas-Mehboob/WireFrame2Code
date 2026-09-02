import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { wireframeRecords } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    const { id, imageUrl, userDescription, aiModel } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    // Upsert instead of a plain insert. If the client retries with the same
    // `id` (e.g. the user hits "Convert to Code" again after an AI failure,
    // without re-uploading a new image), the recordId in React state is
    // unchanged, so a plain insert would violate the primary key unique
    // constraint and throw a 500. onConflictDoUpdate makes this idempotent:
    // a retry just refreshes the row instead of erroring.
    const [record] = await db
      .insert(wireframeRecords)
      .values({
        ...(id ? { id } : {}),
        imageUrl,
        userDescription,
        aiModel,
      })
      .onConflictDoUpdate({
        target: wireframeRecords.id,
        set: {
          imageUrl,
          userDescription,
          aiModel,
        },
      })
      .returning();

    return NextResponse.json(record);
  } catch (err) {
    console.error("[wireframe-2-code POST]", err);
    return NextResponse.json(
      { error: "Failed to save record" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, generatedCode, status } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 },
      );
    }

    const [record] = await db
      .update(wireframeRecords)
      .set({ generatedCode, status })
      .where(eq(wireframeRecords.id, id))
      .returning();

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 },
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