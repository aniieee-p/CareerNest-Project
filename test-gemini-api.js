import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: './backend/.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGeminiAPI() {
  try {
    console.log("Testing Gemini API...");
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction: "You are a helpful assistant. Respond briefly.",
    });

    const result = await model.generateContent("Hello, can you respond with just 'API working'?");
    const response = result.response.text();
    
    console.log("✅ API Response:", response);
    console.log("✅ Gemini API is working!");
    
  } catch (error) {
    console.error("❌ Gemini API Error:");
    console.error("Error message:", error.message);
    
    if (error.message.includes("429")) {
      console.log("🚫 Rate limit exceeded - wait and try again");
    } else if (error.message.includes("403")) {
      console.log("🔑 API key issue - check your key");
    } else if (error.message.includes("quota")) {
      console.log("📊 Quota exceeded - upgrade or wait for reset");
    }
  }
}

testGeminiAPI();