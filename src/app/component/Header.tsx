"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router import

const Navbar = () => {
  const [active, setActive] = useState("");
  const router = useRouter(); // Router ka instance

  const handleNavigation = (path: string, page: string) => {
    setActive(page); // Active state update
    router.push(path); // Next.js page navigate karega
  };

  return (
    <nav className="bg-black p-4 shadow-md py-10">
      <div className="container mx-auto flex justify-center items-center">
        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleNavigation("/", "home")}
            className={`px-5 py-2 text-white border-2 border-red-500 rounded-md transition-all duration-300 ${
              active === "home"
                ? "bg-red-500"
                : "hover:bg-red-500 hover:text-black"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("/Chat", "Chat")}
            className={`px-5 py-2 text-white border-2 border-red-500 rounded-md transition-all duration-300 ${
              active === "Chat"
                ? "bg-red-500"
                : "hover:bg-red-500 hover:text-black"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => handleNavigation("/Voice", "Voice")}
            className={`px-5 py-2 text-white border-2 border-red-500 rounded-md transition-all duration-300 ${
              active === "about"
                ? "bg-red-500"
                : "hover:bg-red-500 hover:text-black"
            }`}
          >
            Voice & Chat
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
