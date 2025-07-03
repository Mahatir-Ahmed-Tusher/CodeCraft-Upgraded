import { NextRequest } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional, for team deployments

export async function POST(req: NextRequest) {
  if (!VERCEL_TOKEN) {
    return new Response("Vercel token not set", { status: 500 });
  }

  const { files, projectName } = await req.json();
  if (!files || typeof files !== "object") {
    return new Response("Missing files", { status: 400 });
  }

  // Prepare files for Vercel API
  const vercelFiles = Object.entries(files).map(([path, content]) => ({
    file: path,
    data: content,
  }));

  const body = {
    name: projectName || `instantcoder-app-${Date.now()}`,
    files: vercelFiles,
    projectSettings: {
      framework: "create-react-app",
    },
    // teamId: VERCEL_TEAM_ID, // Uncomment if using a team
  };

  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    return new Response(`Vercel deploy failed: ${error}`, { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify({ url: data.url }), {
    headers: { "Content-Type": "application/json" },
  });
} 