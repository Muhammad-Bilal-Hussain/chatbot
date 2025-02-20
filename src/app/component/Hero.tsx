import React from 'react';
import { Mic, MessageCircle } from 'lucide-react';

export default function Hero() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-black to-red-900 px-4 py-8">
      <div className="max-w-4xl text-center text-white space-y-5">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Experience AI Like Never Before
        </h1>
        <p className="text-base sm:text-lg text-gray-300">
          Choose how you interact with AI – <span className="font-semibold">Type or Talk!</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-6 w-full">
          {/* Chatbot Card */}
          <div className="bg-black p-5 sm:p-6 rounded-2xl shadow-lg flex flex-col items-center w-full sm:w-1/2 max-w-sm">
            <MessageCircle size={40} className="text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4">Chatbot</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 text-center">
              💬 Type and chat with an intelligent AI that understands and responds instantly.
            </p>
            <a href="/Chat">
              <button className="mt-4 px-4 py-2 w-full sm:w-auto rounded-lg bg-blue-500 hover:bg-blue-600 text-white">
                Start Chatting
              </button>
            </a>
          </div>

          {/* Voice Assistant Card */}
          <div className="bg-black p-5 sm:p-6 rounded-2xl shadow-lg flex flex-col items-center w-full sm:w-1/2 max-w-sm">
            <Mic size={40} className="text-red-400" />
            <h2 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4">Voice Assistant</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 text-center">
              🎙️ Speak naturally and let the AI listen, understand, and respond with voice.
            </p>
            <a href="/Voice">
              <button className="mt-4 px-4 py-2 w-full sm:w-auto rounded-lg bg-red-500 hover:bg-red-600 text-white">
                Start Talking
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
