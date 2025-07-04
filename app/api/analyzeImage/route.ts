import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';
import { z } from 'zod';

const RequestSchema = z.object({
  imageData: z.string().min(1, 'Image data is required'),
  prompt: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { imageData, prompt } = await req.json();
    const result = RequestSchema.safeParse({ imageData, prompt });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 422 }
      );
    }

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

    const response = await fetch('/api/analyzeImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,  // Your base64 image string or URL
        prompt: `Analyze this image: ${visionPrompt}` // Combined text prompt
      }),
    });

    const analysis = await response.json();
    
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