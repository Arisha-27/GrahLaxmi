'use client';

import {
  Mic,
  Send,
  MessageSquare,
  Settings,
  Plus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/lib/firebase';
import { signOut } from 'firebase/auth';
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";
// import Sidebar from '@/components/Sidebar';
import {
  Menu,
  Home,
  Landmark,
  MessageCircle,
  LogOut,
  X,
} from 'lucide-react';

// ✅ Voice Recognition Setup
const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
}

export default function Chatbot() {
  const [user] = useAuthState(auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);


   const goTo = (path) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const [chats, setChats] = useState(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats, currentChatId]);

  const speak = (text, onEnd) => {
    if (!isSpeakingEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const currentChat = chats.find((c) => c.id === currentChatId);

  const replaceLastBotReply = (chatId, newText) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages.slice(0, -1),
                { sender: "bot", text: newText },
              ],
            }
          : c
      )
    );
  };

  const handleSend = async (externalInput = null) => {
    const userInput = (externalInput || input).trim();
    if (!userInput) return;

    let chatId = currentChatId;
    const userMsg = { sender: "user", text: userInput };

    if (!chatId) {
      chatId = uuidv4();
      setChats((prev) => [
        ...prev,
        { id: chatId, title: userInput.slice(0, 25), messages: [] },
      ]);
      setCurrentChatId(chatId);
    }

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, userMsg] } : c
      )
    );
    setInput("");

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { sender: "bot", text: "🔄 Thinking..." },
              ],
            }
          : c
      )
    );

    try {
      const resp = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "financial-women-app",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            messages: [{ role: "user", content: userInput }],
          }),
        }
      );

      const data = await resp.json();
      const markdownReply =
        data.choices?.[0]?.message?.content || "🤖 Sorry, no response.";
      replaceLastBotReply(chatId, marked.parse(markdownReply));
      speak(markdownReply);
    } catch (error) {
      replaceLastBotReply(chatId, "⚠️ Error: " + error.message);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setInput("");
  };

  const switchChat = (id) => {
    setCurrentChatId(id);
    setInput("");
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    setIsRecording(true);
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      setInput(finalTranscript + interim);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      alert("Voice input error: " + event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  
  return (
    <div className="flex w-screen h-screen overflow-hidden text-[#222] bg-[#fdf7ee]">
      {/* ☰ Hamburger Icon */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-[#203C5B] p-2 rounded-full shadow-md hover:bg-[#e28555] transition-colors"
        >
          <Menu className="text-white w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-[#f2c66d]/30 shadow-2xl p-6 pt-14 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-[#203C5B] hover:text-[#e28555] transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div onClick={() => goTo('/dashboard')} className="cursor-pointer flex flex-col items-center mb-6">
          <Image
            src={user?.photoURL || '/default-avatar.png'}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full border-2 border-[#e28555]"
          />
          <h2 className="text-base font-semibold mt-2 text-[#203C5B]">
            {user?.displayName || 'User'}
          </h2>
          <p className="text-[#666] text-xs">{user?.email || ''}</p>
        </div>

        <nav className="flex flex-col gap-4 text-[#203C5B] font-medium text-sm">
          <p onClick={() => goTo('/dashboard')} className="flex items-center gap-2 cursor-pointer hover:text-[#e28555]">
            <Home className="w-5 h-5" /> Dashboard
          </p>
          <p onClick={() => goTo('/govt_scheme')} className="flex items-center gap-2 cursor-pointer hover:text-[#e28555]">
            <Landmark className="w-5 h-5" /> Govt Schemes
          </p>
          <p onClick={() => goTo('/chatbot')} className="flex items-center gap-2 cursor-pointer hover:text-[#e28555]">
            <MessageCircle className="w-5 h-5" /> Chatbot
          </p>
          <p
            onClick={async () => {
              await signOut(auth);
              router.push('/login');
            }}
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:underline"
          >
            <LogOut className="w-5 h-5" /> Logout
          </p>
        </nav>
      </div>
      {/* Sidebar */}
<aside className="w-72 bg-gradient-to-b from-[#F2C66D] via-[#f4e4d7] to-[#F2C66D] text-[#222] p-6 flex flex-col justify-between border-r border-[#e8d1a0] shadow-xl">
  {/* Top Logo & Title */}
  <div className="flex flex-col items-center gap-4">
    <img
      src="/icons/logo.png"
      alt="Logo"
      className="w-20 h-20 rounded-full shadow-lg border-4 border-white/40"
    />
    <div className="text-center space-y-1">
      <h1 className="text-2xl font-extrabold tracking-wide text-[#222]">
        GrahLaxmi AI
      </h1>
      <p className="text-sm text-[#444] italic">Your Finance Companion</p>
    </div>

    <button
      onClick={handleNewChat}
      className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#203c5b] hover:bg-[#203c5bd7] text-white font-medium rounded-full transition duration-200 shadow-lg"
    >
      <Plus className="w-4 h-4" />
      New Chat
    </button>
  </div>

  {/* Chat List */}
  <div className="mt-8 flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-[#d9c8aa] scrollbar-track-transparent">
    {chats.map((c) => (
      <button
        key={c.id}
        onClick={() => switchChat(c.id)}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition shadow-sm ${
          c.id === currentChatId
            ? "bg-[#203c5b] text-white font-semibold"
            : "bg-[#fdf7ee] hover:bg-[#fcead8] text-[#333]"
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        <span className="truncate">{c.title}</span>
      </button>
    ))}
  </div>

  {/* Footer Settings */}
  <div className="pt-5 border-t border-[#e8d1a0] text-sm text-[#666] text-center">
    <button
      onClick={() => alert("Settings & Help Coming Soon!")}
      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdf7ee] hover:bg-[#e8d1a0] text-[#203c5b] font-semibold transition shadow-md"
    >
      <Settings className="w-4 h-4" />
      <span>Settings & Help</span>
    </button>
  </div>
</aside>


      {/* Main Chat Area */}
      <div className="relative flex-1 flex items-center justify-center bg-[#fdf7ee]">
        <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-br from-[#fdf7ee] to-[#e8d1a0]" />

        <div className="w-[70%] h-[85%] bg-[#fdf7ee]/90 backdrop-blur-md shadow-2xl rounded-[60px] flex flex-col overflow-hidden z-10">
          <div className="text-xl font-semibold px-10 py-4 border-b bg-[#fdf7ee]/80 text-center">
            👋 Hello, {userName || "Guest"}!
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {currentChat?.messages?.map((msg, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ease-in-out transform hover:scale-[1.01] text-sm px-5 py-3 rounded-2xl max-w-[75%] shadow-md whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "ml-auto bg-[#203c5b] text-white text-right rounded-br-none"
                    : "bg-white text-[#222] text-left rounded-bl-none"
                }`}
              >
                <div
                  className="prose prose-sm max-w-none [&>a]:text-[#203c5b] [&>a:hover]:underline"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {!currentChat && (
              <div className="bg-white/90 rounded-2xl px-5 py-4 shadow-md max-w-[70%] text-left text-sm transition text-[#222]">
                👋 <strong>Welcome to GrahLaxmi... Your personalized Finchat ChatBot!</strong>
                <br />
                I'm here to help you with finance tips, planning & questions.
                <br />
                Hit “New Chat” or ask your first question to begin!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="px-6 py-4 border-t bg-white flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-full ${
                  isRecording ? "bg-[#e28555]" : "bg-[#203c5b]"
                } text-white hover:scale-105 transition`}
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about income, scheme, goal..."
                className="flex-1 p-3 rounded-full border border-gray-300 bg-[#fdf7ee] text-[#222]"
              />
              <button
                onClick={() => handleSend()}
                className="bg-[#203c5b] text-white p-3 rounded-full hover:bg-[#345272] transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (isSpeakingEnabled) stopSpeaking();
                  setIsSpeakingEnabled(!isSpeakingEnabled);
                }}
                className="flex items-center gap-2 text-sm px-4 py-1 rounded-full border border-[#203c5b] text-[#203c5b] hover:bg-[#e8d1a0] bg-[#fdf7ee] transition"
              >
                {isSpeakingEnabled ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Mute Bot Voice
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Enable Bot Voice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
