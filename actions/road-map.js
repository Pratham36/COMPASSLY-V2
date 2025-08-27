"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCareerRoadmap(resumeJson) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
You are an expert career mentor and curriculum designer.
Analyze this resume and create a detailed ReactFlow roadmap.

Resume:
${JSON.stringify(resumeJson, null, 2)}

Guidelines:
- Include industry in JSON.
- Structure: Fundamentals → Core → Advanced → Specialization
- Each node: {id, type:"turbo", data:{title, description, link}}
- Edges: {id, source, target, type:"smoothstep"}
- 20–25 nodes minimum
- Output ONLY valid JSON:
{
  industry: "...",
  roadmapTitle: "...",
  description: "...",
  duration: "...",
  initialNodes: [...],
  initialEdges: [...]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const json = JSON.parse(match[0]);
    return json;
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err);
    return null;
  }
}

export async function saveRoadMap({ forceRegenerate = false } = {}) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { resume: true },
  });
  if (!user || !user.resume) throw new Error("User or resume not found");

  if (!forceRegenerate) {
    const existing = await db.roadmap.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;
  }

  const roadmap = await generateCareerRoadmap(user.resume.content);
  if (!roadmap) throw new Error("AI did not return valid roadmap JSON");

  const safeRoadmap = {
    roadmapTitle: roadmap.roadmapTitle || "Untitled Roadmap",
    description: roadmap.description || "No description provided.",
    duration: roadmap.duration || "Flexible",
    industry: roadmap.industry || "General",
    initialNodes: Array.isArray(roadmap.initialNodes) ? roadmap.initialNodes : [],
    initialEdges: Array.isArray(roadmap.initialEdges) ? roadmap.initialEdges : [],
  };

  return db.roadmap.create({
    data: {
      userId: user.id,
      ...safeRoadmap,
    },
  });
}
