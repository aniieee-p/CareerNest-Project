import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { Job } from "../models/job.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT =
  "You are CareerNest AI, a helpful career assistant. Help job seekers with resume tips, interview preparation, job search strategies, salary negotiation, and career guidance. Be concise, friendly, and practical.";

// ================= CHAT =================
export const chat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: "messages array is required." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert to Gemini history format (all but the last message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(lastMessage.content);
    const reply = result.response.text();

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Gemini chat error:", error.message);
    return res.status(500).json({ success: false, message: "AI service error." });
  }
};

// Common tech skills keyword list
const SKILL_KEYWORDS = [
  "javascript","typescript","python","java","c++","c#","ruby","go","rust","php","swift","kotlin",
  "react","vue","angular","nextjs","nuxt","svelte","html","css","tailwind","bootstrap","sass",
  "nodejs","express","django","flask","fastapi","spring","laravel","rails",
  "mongodb","mysql","postgresql","sqlite","redis","firebase","supabase","dynamodb",
  "aws","azure","gcp","docker","kubernetes","terraform","ci/cd","github actions",
  "git","linux","bash","rest","graphql","websocket","microservices","kafka","rabbitmq",
  "machine learning","deep learning","tensorflow","pytorch","scikit-learn","pandas","numpy",
  "figma","photoshop","ui/ux","agile","scrum","jira","sql","nosql","data structures","algorithms",
];

// Extract skills from resume text
const extractSkills = (text) => {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter(skill => lower.includes(skill));
};

// ================= PARSE RESUME =================
export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file uploaded." });
    }

    // Extract text from PDF buffer
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Extract skills
    const skills = extractSkills(text);

    if (skills.length === 0) {
      return res.status(200).json({
        success: true,
        skills: [],
        matchedJobs: [],
        message: "No recognizable skills found in resume.",
      });
    }

    // Match jobs from DB using regex on requirements
    const matchedJobs = await Job.find({
      requirements: {
        $elemMatch: {
          $in: skills.map(s => new RegExp(s, "i")),
        },
      },
    })
      .populate("company")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      skills,
      matchedJobs,
      message: `Found ${matchedJobs.length} matching jobs based on your resume.`,
    });

  } catch (error) {
    console.error("Resume parse error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to parse resume." });
  }
};

// ================= ROLE MATCH (kept for existing route) =================
export const roleMatch = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Answers are required." });
    }
    return res.status(200).json({ success: true, roles: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
