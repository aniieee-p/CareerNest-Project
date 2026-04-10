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

// ================= ROLE MATCH =================
const FALLBACK_ROLES = {
  "Coding+Web Dev":       [{ role: "Full Stack Developer", why: "Your coding skills and web dev interest are a natural fit.", skills: ["React", "Node.js", "MongoDB", "REST APIs"], salary: "$70k–$110k" }, { role: "Backend Engineer", why: "Strong coding background suits server-side development.", skills: ["Node.js", "Express", "SQL", "Docker"], salary: "$75k–$115k" }, { role: "Frontend Developer", why: "Coding + web interest maps directly to UI engineering.", skills: ["React", "TypeScript", "CSS", "Figma"], salary: "$65k–$100k" }],
  "Design+UI/UX":         [{ role: "UI/UX Designer", why: "Design skills and UI/UX interest are a perfect match.", skills: ["Figma", "Prototyping", "User Research", "CSS"], salary: "$60k–$95k" }, { role: "Product Designer", why: "Design thinking drives great product experiences.", skills: ["Figma", "Design Systems", "Wireframing", "Usability Testing"], salary: "$70k–$105k" }, { role: "Frontend Developer", why: "Design skills complement frontend UI work.", skills: ["React", "CSS", "Tailwind", "Figma"], salary: "$65k–$100k" }],
  "Analytics+Data":       [{ role: "Data Analyst", why: "Analytics skills are core to data-driven decision making.", skills: ["SQL", "Python", "Tableau", "Excel"], salary: "$60k–$90k" }, { role: "Data Scientist", why: "Analytical mindset suits ML and statistical modeling.", skills: ["Python", "Machine Learning", "Pandas", "Statistics"], salary: "$80k–$120k" }, { role: "Business Analyst", why: "Analytics + communication drives business insights.", skills: ["SQL", "Excel", "Power BI", "Requirements Gathering"], salary: "$65k–$95k" }],
  "Communication+Management": [{ role: "Product Manager", why: "Communication and leadership are key PM traits.", skills: ["Roadmapping", "Agile", "Stakeholder Management", "Jira"], salary: "$85k–$130k" }, { role: "Scrum Master", why: "Communication skills are essential for agile facilitation.", skills: ["Scrum", "Agile", "Jira", "Team Facilitation"], salary: "$75k–$110k" }, { role: "Technical Recruiter", why: "Strong communication suits talent acquisition roles.", skills: ["Sourcing", "Interviewing", "ATS Tools", "Networking"], salary: "$55k–$85k" }],
};

const getFallbackRoles = (answers) => {
  const key = `${answers.skill}+${answers.interest}`;
  if (FALLBACK_ROLES[key]) return FALLBACK_ROLES[key];
  // generic fallback
  return [
    { role: "Software Developer", why: "A versatile role that fits most tech backgrounds.", skills: ["JavaScript", "Git", "REST APIs", "Problem Solving"], salary: "$65k–$100k" },
    { role: "Product Manager", why: "Bridges tech and business across all domains.", skills: ["Agile", "Roadmapping", "Communication", "Jira"], salary: "$80k–$120k" },
    { role: "Business Analyst", why: "Analytical and communication skills drive this role.", skills: ["SQL", "Excel", "Requirements Gathering", "Stakeholder Mgmt"], salary: "$60k–$90k" },
  ];
};

export const roleMatch = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Answers are required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a career advisor. Based on the following quiz answers, suggest exactly 3 suitable career roles.

Quiz answers:
- Strongest skill: ${answers.skill}
- Preferred work style: ${answers.workStyle}
- Experience level: ${answers.experience}
- Interest area: ${answers.interest}
- Preferred company size: ${answers.companySize}

Respond ONLY with a valid JSON array (no markdown, no explanation) with exactly 3 objects, each having:
- "role": job title (string)
- "why": one sentence explaining why it fits (string)
- "skills": array of 3-4 key skills needed (strings)
- "salary": typical salary range e.g. "$60k–$90k" (string)

Example format:
[{"role":"Frontend Developer","why":"...","skills":["React","CSS","JavaScript"],"salary":"$70k–$100k"}]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    const roles = JSON.parse(text);
    return res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("roleMatch error:", error.message);
    // Fallback to curated roles so the quiz never breaks
    const roles = getFallbackRoles(req.body.answers || {});
    return res.status(200).json({ success: true, roles, fallback: true });
  }
};
