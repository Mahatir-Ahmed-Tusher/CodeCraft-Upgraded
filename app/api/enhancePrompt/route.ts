import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY || "";

export async function POST(req: Request) {
  let json = await req.json();
  let result = z
    .object({
      prompt: z.string(),
    })
    .safeParse(json);

  if (result.error) {
    return new Response(result.error.message, { status: 422 });
  }

  let { prompt } = result.data;

  // Check if Google AI API key is available
  if (!apiKey) {
    return new Response(JSON.stringify({ enhanced: prompt }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an expert at writing clear, detailed prompts for AI code generation. Given a user prompt, rewrite it to be more specific, detailed, and effective for generating high-quality, functional code. Add any missing details, clarify vague requests, and make it as actionable as possible. Only return the improved prompt, nothing else.`;

    const response = await geminiModel.generateContent([
      { text: `${systemPrompt}\n\nUser prompt: ${prompt}` }
    ]);

    const enhanced = response.response.text().trim();

    return new Response(JSON.stringify({ enhanced }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // Fallback to original prompt if enhancement fails
    return new Response(JSON.stringify({ enhanced: prompt }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}