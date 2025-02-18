"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    // Add user message to chat
    const newChat = [...chatHistory, { role: "user", text: message }];
    setChatHistory(newChat);
    setMessage("");

      // Check for the 'who is your founder' query
  if (message.toLowerCase().includes("who is your founder")) {
    setChatHistory([...newChat, { role: "ai", text: "My founder is Muhammad Bilal Hussain." }]);
    setLoading(false);
    return; // Exit early to avoid calling the API
  }

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: `Reply in a natural and conversational way. Keep it short and simple, without extra headings or unnecessary details.\n\nUser: ${message}` }),
        });

        const data = await res.json();

        // Clean HTML tags and ensure it's in proper format
        const cleanResponse = data.reply
            .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
            .replace(/(?:\r\n|\r|\n)/g, '<br>') // Handle newlines
            .replace(/(\*\*[^*]+\*\*)/g, '<b>$1</b>'); // Bold handling
        
        setChatHistory([...newChat, { role: "ai", text: cleanResponse }]);

    } catch (error) {
        setChatHistory([...newChat, { role: "ai", text: "❌ Failed to fetch response" }]);
    }
    setLoading(false);
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
    <div className="max-w-full h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-10 ">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-lg md:max-w-xl lg:max-w-2xl">
            <h1 className="text-xl font-bold text-center mb-4">💬 AI Chatbot</h1>

            {/* Chat Window */}
            <div
              ref={chatContainerRef}
              className="h-[40vh] overflow-y-auto p-3 border rounded-lg bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            >
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 rounded-lg max-w-[80%] text-sm sm:text-base ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white self-end ml-auto text-left"
                      : "bg-gray-300 text-black text-left"
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }} // Render HTML
                />
              ))}
            </div>

            {/* Input Area */}
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3 text-sm sm:text-base"
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
              className="w-full mt-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
