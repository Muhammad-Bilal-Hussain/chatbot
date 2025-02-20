"use client";
import { useState } from "react";

type SpeechRecognitionEventType = {
  results: SpeechRecognitionResultList;
};

const Voice = () => {
  const [text, setText] = useState(""); // Recognized text
  const [reply, setReply] = useState(""); // AI ka response
  const [isListening, setIsListening] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  // ✅ Speech Recognition Setup
  const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
  recognition.continuous = true; // 🟢 Continuous listening enable
  recognition.interimResults = false;
  recognition.lang = "en-US";

  // ✅ Start Listening Function
  const startListening = () => {
    setIsListening(true);
    setText(""); // Reset text before new recognition
    recognition.start();
  };

  let spokenText = ""; // Define spokenText in the outer scope

  // ✅ Speech Recognition Event Handling
  recognition.onresult = async (event: SpeechRecognitionEventType) => {
    spokenText = "";
    for (let i = 0; i < event.results.length; i++) {
      spokenText += event.results[i][0].transcript.trim() + " ";
    }
    setText(spokenText.trim()); // Save full speech text

    // ✅ Jab user bolna band kare to recognition stop ho
    setTimeout(() => {
      recognition.stop();
    }, 2000); // 2 sec tak silence detect karega
  };

  // ✅ Speech Recognition Stopped / End Handling
  recognition.onend = async () => {
    setIsListening(false); // Listening ko reset karo

    if (!text.trim()) {
      setReply("I didn't hear anything.");
      return;
    }

    // ✅ AI Response lene ke liye API request bhejna
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemMessage: "You are a helpful AI assistant. Answer clearly and correctly.",
          chatHistory: [
            { role: "user", text: spokenText }
          ]
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setReply(data.reply);
        speakText(data.reply); // 🗣️ AI ka jawab bolwana
      } else {
        setReply("No response from AI.");
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setReply("Error getting response.");
    }
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error:", event.error);
    setIsListening(false);
  };

  // ✅ Text to Speech Function
  const speakText = (message: string) => {
    if (speech) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    setSpeech(utterance);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center p-4">
      <h2 className="text-lg font-bold mb-4 text-white">Voice Assistant</h2>

      {/* Start Listening Button */}
      <button
        onClick={startListening}
        className={`px-4 py-2 rounded-md ${
          isListening ? "bg-red-700 text-white" : "bg-white border border-red-700 text-red-700"
        }`}
      >
        {isListening ? "Listening..." : "Start Speaking"}
      </button>

      {/* Display Recognized Text */}
      {text && <p className="mt-4 text-lg font-semibold text-white">You said: {text}</p>}
      {reply && <p className="mt-4 text-lg font-semibold text-white">AI says: {reply}</p>}
    </div>
  );
};

export default Voice;
