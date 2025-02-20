import React from 'react';
import { Mic, MessageCircle } from 'lucide-react';

export default function Hero() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-black to-red-900 px-6">
      <div className="max-w-4xl text-center text-white space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          Experience AI Like Never Before
        </h1>
        <p className="text-lg text-gray-300">
          Choose how you interact with AI – <span className="font-semibold">Type or Talk!</span>
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center mt-6">
          <div className="bg-black p-6 rounded-2xl shadow-lg flex flex-col items-center w-full md:w-1/2">
            <MessageCircle size={40} className="text-blue-400" />
            <h2 className="text-2xl font-bold mt-4">Chatbot</h2>
            <p className="text-gray-400 text-sm mt-2">
              💬 Type and chat with an intelligent AI that understands and responds instantly. Perfect for quick conversations and queries.
            </p>
            <button className="mt-4 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"><a href="/Chat">Start Chatting</a></button>
          </div>

          <div className="bg-black p-6 rounded-2xl shadow-lg flex flex-col items-center w-full md:w-1/2">
            <Mic size={40} className="text-red-400" />
            <h2 className="text-2xl font-bold mt-4">Voice Assistant</h2>
            <p className="text-gray-400 text-sm mt-2">
              🎙️ Speak naturally and let the AI listen, understand, and respond with voice. Ideal for hands-free interaction.
            </p>
            <button className="mt-4 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"><a href="/Voice">Start Talking</a></button>
          </div>
        </div>
      </div>
    </div>
  );
}
