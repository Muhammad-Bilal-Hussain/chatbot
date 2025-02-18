"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false); // State to handle "Copied" message
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    // Add user message to chat
    const newChat = [...chatHistory, { role: "user", text: message }];
    setChatHistory(newChat);
    setMessage("");

    // Check for the 'who created you' query in various languages and short forms
    const lowerMessage = message.toLowerCase();
    const creatorQueries = [
      "who created you",
      "who is your developer",
      "who built you",
      "who is the maker of this ai",
      "who is your creator",
      "who is behind your creation",
      "who is your founder",
      "what is your origin",
      "who made you",
      "who is ur founder", // Short form 'ur' for 'your'
      "who is ur creator", // Short form 'ur'
      "who made u", // Informal version
      "who is ur developer", // Short form 'ur'
      "who built u", // Informal version
      "who is ur maker", // Short form 'ur'
      "किसने तुम्हें बनाया", // Hindi: Who created you?
      "आपका निर्माता कौन है", // Hindi: Who is your creator?
      "आपका निर्माता कौन है?", // Another Hindi version
      "आपने मुझे कौन बनाया?", // Another Hindi version
    ];

    if (creatorQueries.some((query) => lowerMessage.includes(query))) {
      setChatHistory([...newChat, { role: "ai", text: "Muhammad Bilal Hussain" }]);
      setLoading(false);
      return; // Exit early to avoid calling the API
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Reply in a natural and conversational way. Keep it short and simple, without extra headings or unnecessary details.\n\nUser: ${message}`,
        }),
      });

      const data = await res.json();

      // Clean HTML tags and ensure it's in proper format
      const cleanResponse = data.reply
        .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
        .replace(/(?:\r\n|\r|\n)/g, "<br>") // Handle newlines
        .replace(/(\*\*[^*]+\*\*)/g, "<b>$1</b>"); // Bold handling

      setChatHistory([...newChat, { role: "ai", text: cleanResponse }]);
    } catch {
      setChatHistory([...newChat, { role: "ai", text: "❌ Failed to fetch response" }]);
    }
    setLoading(false);
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true); // Show "Copied" message
      setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
    });
  };

  // Scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle Enter key press
  const handleKeyDown = (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
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
            <h1 className="text-xl font-bold text-center mb-4 text-red-700">💬 AI Chatbot</h1>

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
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} /> {/* Render HTML */}

                  {msg.role === "ai" && (
                    <button
                      onClick={() => copyToClipboard(msg.text)}
                      className=" text-right text-xs text-red-700"
                    >
                      Copy
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mt-3 text-sm sm:text-base"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            ></textarea>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-full mt-3 p-2 bg-black text-red-700 rounded-lg border border-red-600 hover:shadow-red-500 shadow-lg disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* "Copied" Message */}
      {copied && (
        <div className="border border-red-600 fixed bottom-10 right-10 p-3 bg-black text-red-700 rounded-lg opacity-90 transition-opacity duration-1000">
          Copied!
        </div>
      )}
    </div>
  );
}
