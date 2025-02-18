import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ GET Request ke liye API Route
export async function GET(req: Request) {
  return NextResponse.json({ message: "Use POST method to chat with AI" });
}

// ✅ POST Request ke liye API Route
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = "AIzaSyASsId60KDqb4DcrhJs-Ia65C-fWONCboA";
    if (!apiKey) {
      console.error("❌ API Key not found!");
      return NextResponse.json({ error: "API key not found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("✅ Sending Request to Gemini...");
    
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    console.log("✅ API Response Received:", result);

    if (!result.response?.candidates?.length) {
      return NextResponse.json({ error: "No response from Gemini" }, { status: 500 });
    }

    const reply = result.response.candidates[0].content.parts[0].text || "No response";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
