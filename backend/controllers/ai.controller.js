import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const roleMatch = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Answers are required." });
    }

    const prompt = `You are a career advisor. Based on the following quiz answers, recommend exactly 3 job roles.

User answers:
- Strongest skill: ${answers.skill}
- Preferred work style: ${answers.workStyle}
- Experience level: ${answers.experience}
- Interest area: ${answers.interest}
- Preferred company size: ${answers.companySize}

Respond ONLY with a valid JSON array (no markdown, no code blocks, no explanation) in this exact format:
[
  {
    "role": "Role Title",
    "why": "Two sentence explanation of why this suits them.",
    "skills": ["Skill 1", "Skill 2", "Skill 3"],
    "salary": "₹X – ₹Y LPA"
  }
]`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // strip markdown code fences if Gemini adds them
    const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    const roles = JSON.parse(clean);

    return res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Role match error:", error.message);
    return res.status(500).json({ success: false, message: "AI service error. Please try again." });
  }
};
