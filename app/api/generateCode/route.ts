import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define supported models
const SUPPORTED_MODELS = ['gemini-2.0-flash-exp', 'gemini-1.5-flash'];

// Input validation schema
const RequestSchema = z.object({
  model: z.string().refine((val) => SUPPORTED_MODELS.includes(val), {
    message: `Model must be one of: ${SUPPORTED_MODELS.join(', ')}`,
  }),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1, 'Message content cannot be empty'),
    })
  ).min(1, 'At least one message is required'),
});

function getSystemPrompt() {
  return `You are an expert frontend React engineer who is also a great UI/UX designer. Follow the instructions carefully:

- Think carefully step by step.
- Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
- Make sure the React app is interactive and functional by creating state when needed and having no required props
- If you use any imports from React like useState or useEffect, make sure to import them directly
- Use TypeScript as the language for the React component
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. h-[600px]). Make sure to use a consistent color palette.
- Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
- Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. DO NOT START WITH \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.
- ONLY IF the user asks for a dashboard, graph or chart, the recharts library is available to be imported, e.g. import { LineChart, XAxis, ... } from "recharts" & <LineChart ...><XAxis dataKey="name"> ...
- For placeholder images, please use a <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
- NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.`;
}

export async function POST(req: Request) {
  try {
    // Validate API key
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing GOOGLE_AI_API_KEY' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const json = await req.json();
    const result = RequestSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 422 }
      );
    }

    const { model, messages } = result.data;

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    // Combine system prompt with user input
    const systemPrompt = getSystemPrompt();
    const userPrompt = messages[0].content;
    const fullPrompt = `${userPrompt}\n${systemPrompt}\nPlease ONLY return code, NO backticks or language names. Don't start with \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.`;

    // Check prompt length (Gemini has token limits, approximate check)
    if (fullPrompt.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Please shorten your request.' },
        { status: 400 }
      );
    }

    // Call Gemini API
    const geminiStream = await geminiModel.generateContentStream(fullPrompt);

    // Create readable stream for response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (streamError: any) {
          console.error('Stream error:', streamError);
          controller.error(new Error(`Streaming error: ${streamError.message}`));
        }
      },
      cancel() {
        // Handle stream cancellation if needed
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error: any) {
    console.error('Error in /api/generateCode:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';