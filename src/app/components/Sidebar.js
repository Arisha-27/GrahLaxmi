"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import { signOut } from "firebase/auth";

import {
  Menu,
  Home,
  Landmark,
  MessageCircle,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  // Navigation helper
  const goTo = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
  {/* ☰ Hamburger Icon */}
  {!isOpen && (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed top-4 left-4 z-50 bg-[#203C5B] p-2 rounded-full shadow-md hover:bg-[#e28555] transition-colors"
      aria-label="Open Sidebar"
    >
      <Menu className="text-white w-6 h-6" />
    </button>
  )}

  {/* Sidebar Panel */}
  <div
    className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-[#f2c66d]/30 shadow-2xl p-6 pt-14 transition-transform duration-300 z-40 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    {/* ❌ Close Button */}
    <button
      onClick={() => setIsOpen(false)}
      className="absolute top-4 right-4 text-[#203C5B] hover:text-[#e28555] transition"
      aria-label="Close Sidebar"
    >
      <X className="w-6 h-6" />
    </button>

    {/* 👤 Profile */}
    <div
      onClick={() => goTo("/dashboard")}
      className="cursor-pointer flex flex-col items-center mb-8 transition-all hover:scale-[1.02]"
    >
      <Image
        src={user?.photoURL || "/default-avatar.png"}
        alt="Profile"
        width={64}
        height={64}
        className="rounded-full border-2 border-[#e28555] shadow-sm"
      />
      <h2 className="text-base font-semibold mt-2 text-[#203C5B] tracking-tight">
        {user?.displayName || "User"}
      </h2>
      <p className="text-[#666] text-xs">{user?.email || ""}</p>
    </div>

    {/* 🌐 Navigation */}
    <nav className="flex flex-col gap-4 text-[#203C5B] font-medium text-sm">
      <button
        onClick={() => goTo("/dashboard")}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#fdf7ee] hover:text-[#e28555] transition-all"
      >
        <Home className="w-5 h-5" />
        Dashboard
      </button>
      <button
        onClick={() => goTo("/govt_scheme")}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#fdf7ee] hover:text-[#e28555] transition-all"
      >
        <Landmark className="w-5 h-5" />
        Govt Schemes
      </button>
      <button
        onClick={() => goTo("/chatbot")}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#fdf7ee] hover:text-[#e28555] transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        Chatbot
      </button>
      {/* Uncomment if needed later */}
      {/* <button
        onClick={() => goTo("/faq")}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#fdf7ee] hover:text-[#e28555] transition-all"
      >
        <HelpCircle className="w-5 h-5" />
        FAQ
      </button> */}
      <button
        onClick={async () => {
          await signOut(auth);
          router.push("/login");
        }}
        className="flex items-center gap-3 px-2 py-2 mt-2 text-red-500 hover:underline transition-all"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </nav>
  </div>
</>

  );
}
