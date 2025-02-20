"use client";
import { useState, useEffect, useRef } from "react";

// ✅ Define Speech Recognition Interface
type SpeechRecognitionType = {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionError) => void) | null;
};

// ✅ Global Window Interface Update
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionType;
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionError extends Event {
    error: string;
  }
}

export default function VoiceChatBot() {
  const [message, setMessage] = useState(""); // Current input message
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [isListening, setIsListening] = useState(false); // Mic status
  const [loading, setLoading] = useState(false); // AI response loading status
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const spokenTextRef = useRef<string>(""); // Variable to hold spoken text

  // ✅ Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false; // Single speech
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          spokenTextRef.current = event.results[0][0].transcript.trim(); // Extract speech text
          setMessage(spokenTextRef.current); // Save spoken text in state
          recognitionRef.current?.stop();
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (spokenTextRef.current.trim()) {
            sendMessage(spokenTextRef.current); // Send message automatically after speech input
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // ✅ Start Listening Function
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // ✅ Function to Send Message (Either Voice or Text)
  const sendMessage = async (inputMessage?: string) => {
    const finalMessage = inputMessage || message.trim();
    if (!finalMessage) return;

    setLoading(true);

    // Add user message to chat
    const newChat = [...chatHistory, { role: "user", text: finalMessage }];
    setChatHistory(newChat);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatHistory: [...chatHistory, { role: "user", text: finalMessage }],
        }),
      });

      const data = await res.json();

      // Clean response & update chat
      const cleanResponse = data.reply.replace(/<\/?[^>]+(>|$)/g, "").trim();
      setChatHistory([...newChat, { role: "ai", text: cleanResponse }]);
      speakText(cleanResponse); // 🗣️ Speak the AI response
    } catch {
      setChatHistory([...newChat, { role: "ai", text: "❌ Failed to fetch response" }]);
    }
    setLoading(false);
  };

  // ✅ Function to Speak AI Response
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // ✅ Handle Enter key for sending text
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-full h-screen bg-black">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="border border-red-500 bg-black rounded-xl p-4 w-full max-w-lg md:max-w-xl lg:max-w-2xl">
            <h1 className="text-xl font-bold text-center mb-4 text-red-700">🎙️ AI Type & Voice Chatbot</h1>

            {/* Chat Window */}
            <div
              ref={chatContainerRef}
              className="border border-red-600 h-[40vh] overflow-y-auto p-3 rounded-lg bg-black text-red-700 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            >
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 rounded-lg max-w-[80%] text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-white text-black self-end ml-auto text-left"
                      : "bg-white text-black text-left"
                  }`}
                >
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Voice & Text Input Section */}
            <div className="flex gap-2 mt-3">
              {/* 🎤 Mic Button */}
              <button
                onClick={startListening}
                className={`p-2 w-16 rounded-lg ${
                  isListening ? "bg-red-700 text-white" : "bg-white border border-red-700 text-red-700"
                }`}
              >
                {isListening ? "🎤" : "🎙️"}
              </button>

              {/* 📝 Text Input */}
              <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
              ></textarea>

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                className="w-16 p-2 bg-black text-red-700 rounded-lg border border-red-600 hover:shadow-red-500 shadow-lg disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "🤔" : "📨"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
