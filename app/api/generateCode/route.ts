import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define supported models with their providers
const SUPPORTED_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'llama-3.3-70b-versatile',
  'deepseek/deepseek-r1-0528:free',
  'mistral-small-latest'
];

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

async function callGeminiAPI(model: string, prompt: string) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Google AI API key not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model });
  const geminiStream = await geminiModel.generateContentStream(prompt);

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of geminiStream.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      } catch (streamError: any) {
        console.error('Gemini stream error:', streamError);
        controller.error(new Error(`Gemini streaming error: ${streamError.message}`));
      }
    },
  });
}

async function callGroqAPI(model: string, prompt: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  return new ReadableStream({
    async start(controller) {
      try {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body from Groq API');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (parseError) {
                // Skip invalid JSON chunks
                continue;
              }
            }
          }
        }
        controller.close();
      } catch (streamError: any) {
        console.error('Groq stream error:', streamError);
        controller.error(new Error(`Groq streaming error: ${streamError.message}`));
      }
    },
  });
}

async function callOpenRouterAPI(model: string, prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'CodeCraft',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  return new ReadableStream({
    async start(controller) {
      try {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body from OpenRouter API');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (parseError) {
                // Skip invalid JSON chunks
                continue;
              }
            }
          }
        }
        controller.close();
      } catch (streamError: any) {
        console.error('OpenRouter stream error:', streamError);
        controller.error(new Error(`OpenRouter streaming error: ${streamError.message}`));
      }
    },
  });
}

async function callMistralAPI(model: string, prompt: string) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('Mistral API key not configured');
  }

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
  }

  return new ReadableStream({
    async start(controller) {
      try {
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body from Mistral API');
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (parseError) {
                // Skip invalid JSON chunks
                continue;
              }
            }
          }
        }
        controller.close();
      } catch (streamError: any) {
        console.error('Mistral stream error:', streamError);
        controller.error(new Error(`Mistral streaming error: ${streamError.message}`));
      }
    },
  });
}

function getModelProvider(model: string): string {
  if (model.startsWith('gemini-')) return 'gemini';
  if (model.includes('llama')) return 'groq';
  if (model.includes('deepseek')) return 'openrouter';
  if (model.includes('mistral')) return 'mistral';
  return 'gemini'; // fallback
}

export async function POST(req: Request) {
  try {
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

    // Combine system prompt with user input
    const systemPrompt = getSystemPrompt();
    const userPrompt = messages[0]?.content || '';
    const fullPrompt = `${userPrompt}\n${systemPrompt}\nPlease ONLY return code, NO backticks or language names. Don't start with \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.`;

    // Check prompt length
    if (fullPrompt.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Please shorten your request.' },
        { status: 400 }
      );
    }

    // Determine provider and call appropriate API
    const provider = getModelProvider(model);
    let stream: ReadableStream;

    switch (provider) {
      case 'gemini':
        stream = await callGeminiAPI(model, fullPrompt);
        break;
      case 'groq':
        stream = await callGroqAPI(model, fullPrompt);
        break;
      case 'openrouter':
        stream = await callOpenRouterAPI(model, fullPrompt);
        break;
      case 'mistral':
        stream = await callMistralAPI(model, fullPrompt);
        break;
      default:
        throw new Error(`Unsupported model provider: ${provider}`);
    }

    return new Response(stream, {
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