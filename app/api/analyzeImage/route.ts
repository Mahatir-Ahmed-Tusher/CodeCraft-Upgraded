import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { z } from 'zod';

const RequestSchema = z.object({
  imageData: z.string().min(1, 'Image data is required'),
  prompt: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = RequestSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 422 }
      );
    }

    const { imageData, prompt } = result.data;

    // Check if Together AI API key is available
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Together AI API key not configured' },
        { status: 500 }
      );
    }

    const together = new Together({
      apiKey: apiKey
    });

    // Create the message content for vision analysis
    const visionPrompt = prompt 
      ? `Analyze this image and describe what you see in detail, focusing on UI/UX elements, layout, design patterns, and functionality. The user wants to: ${prompt}`
      : "Analyze this image and describe what you see in detail, focusing on UI/UX elements, layout, design patterns, colors, typography, and any interactive elements that could be recreated in code.";

    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: visionPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      model: "meta-llama/Llama-Vision-Free",
      max_tokens: 1000,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content;
    
    if (!analysis) {
      throw new Error('No analysis received from vision model');
    }

    return NextResponse.json({ 
      analysis,
      success: true 
    });

  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';