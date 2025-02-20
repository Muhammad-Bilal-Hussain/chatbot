import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ GET Request ke liye API Route
export async function GET() {
  return NextResponse.json({ message: "Use POST method to chat with AI" });
}

// ✅ POST Request ke liye API Route
export async function POST(_req: Request) {
  try {
    const { chatHistory } = await _req.json();
    if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
      return NextResponse.json({ error: "Chat history is required" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      console.error("❌ API Key not found!");
      return NextResponse.json({ error: "API key not found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("✅ Sending Request to Gemini...");
    
    const formattedChatHistory = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // 🟢 Language detection added
    const result = await model.generateContent({
      contents: [
        ...formattedChatHistory,
        {
          role: "user",
          parts: [
            {
              text: `Detect the language of the user's message and reply in the same language naturally. 
              Respond concisely and conversationally.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1000,
      },
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
