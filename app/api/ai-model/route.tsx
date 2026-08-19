import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const apiResponse: any = await client.chat.completions.create({
      model: "google/gemma-4-31b-it:free",
      messages: [
        {
          role: "user" as const,
          content: "How many r's are in the word 'strawberry'?",
        },
      ],
      reasoning: { enabled: true },
    } as any);

    const response = apiResponse.choices[0].message;

    const messages = [
      {
        role: "user" as const,
        content: "How many r's are in the word 'strawberry'?",
      },
      {
        role: "assistant" as const,
        content: response.content,
        reasoning_details: response.reasoning_details,
      },
      {
        role: "user" as const,
        content: "Are you sure? Think carefully.",
      },
    ];

    const response2: any = await client.chat.completions.create({
      model: "google/gemma-4-31b-it:free",
      messages,
    } as any);

    return NextResponse.json({
      firstResponse: response.content,
      secondResponse: response2.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}