import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { imageData, prompt } = await request.json();
    
    const visionPrompt = `Analyze this image and ${prompt}. Be detailed and specific.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
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
      max_tokens: 1000
    });

    return new Response(JSON.stringify({ 
      analysis: response.choices[0]?.message?.content 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return new Response(JSON.stringify({ 
      error: "Failed to analyze image" 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export const runtime = 'edge';