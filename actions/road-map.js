"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCareerRoadmap(resumeJson) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert career mentor and curriculum designer.

Analyze the following resume and infer the most likely career field/industry 
(e.g., Software Development, Medicine, Civil Engineering, Teaching, Law, Business, etc.).

Resume:
${JSON.stringify(resumeJson, null, 2)}

Now generate a career learning and growth roadmap SPECIFICALLY for this field.

Guidelines:
- First, identify the industry from the resume (doctor, teacher, civil engineer, web developer, etc.).
- Then create a roadmap with 20–25 nodes that reflect realistic skills, milestones, or knowledge progression in that industry.
- The roadmap must follow a progression: Fundamentals → Core → Advanced → Specialization.
- Nodes format:
  {id, type:"turbo", data:{title, description, link, level}}
- Edges format:
  {id, source, target, type:"smoothstep"}

Output ONLY valid JSON with the following structure:
{
  industry: "Inferred industry from resume",
  roadmapTitle: "Custom roadmap title",
  description: "Brief description of roadmap",
  duration: "Suggested time frame",
  initialNodes: [...],
  initialEdges: [...]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
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
    initialNodes: Array.isArray(roadmap.initialNodes)
      ? roadmap.initialNodes.map((n, i) => ({
          id: n.id?.toString() || `node-${i}`,
          type: "default",
          data: {
            label: n.data?.title || n.data?.label || `Node ${i + 1}`,
            description: n.data?.description || "",
            link: n.data?.link || null,
            level: n.data?.level || "Fundamentals",
          },
          position: n.position || { x: i * 250, y: 100 },
        }))
      : [],
    initialEdges: Array.isArray(roadmap.initialEdges)
      ? roadmap.initialEdges.map((e, i) => ({
          id: e.id?.toString() || `edge-${i}`,
          source: e.source?.toString(),
          target: e.target?.toString(),
          type: e.type || "smoothstep",
          animated: e.animated ?? false,
        }))
      : [],
  };

  return db.roadmap.create({
    data: {
      userId: user.id,
      ...safeRoadmap,
    },
  });
}
