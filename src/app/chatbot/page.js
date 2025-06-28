'use client';
import { Mic, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";
import { Settings } from "lucide-react"; 

export default function Chatbot() {
  const [chats, setChats] = useState(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats, currentChatId]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
    }
  }, []);

  const speak = (text, onEnd) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  };

  const currentChat = chats.find(c => c.id === currentChatId);

  const replaceLastBotReply = (chatId, newText) => {
    setChats(prev =>
      prev.map(c =>
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

  const handleSend = async () => {
    const userInput = input.trim();
    if (!userInput) return;

    let chatId = currentChatId;
    const userMsg = { sender: "user", text: userInput };

    if (!chatId) {
      chatId = uuidv4();
      setChats(prev => [...prev, { id: chatId, title: userInput.slice(0, 25), messages: [] }]);
      setCurrentChatId(chatId);
    }

    setChats(prev =>
      prev.map(c =>
        c.id === chatId ? { ...c, messages: [...c.messages, userMsg] } : c
      )
    );
    setInput("");

    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, { sender: "bot", text: "🔄 Thinking..." }] }
          : c
      )
    );

    try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "financial-women-app",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          messages: [{ role: "user", content: userInput }]
        })
      });

      const data = await resp.json();
      const markdownReply = data.choices?.[0]?.message?.content || "🤖 Sorry, no response.";
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

  return (
    <div className="flex w-screen h-screen overflow-hidden text-[#222] bg-[#fdf7ee]">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#F2C66D] via-[#E8D1A0] to-[#D8A39D] text-[#222] p-6 flex flex-col justify-between border-r shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <img src="/icons/logo.png" alt="Logo" className="w-18 h-14 rounded-full shadow-md" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">GrahLaxmi AI</h1>
            <p className="text-xs text-[#666]">Your Finance Companion</p>
          </div>
          <button
            onClick={handleNewChat}
            className="mt-4 px-5 py-2 bg-[#203c5b] text-white rounded-full hover:bg-[#345272] transition-colors duration-200 text-sm shadow-md"
          >
            ➕ New Chat
          </button>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto space-y-2 pr-1">
          {chats.map(c => (
            <button
              key={c.id}
              onClick={() => switchChat(c.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition shadow-sm ${
                c.id === currentChatId
                  ? "bg-[#203c5b] text-white font-semibold"
                  : "bg-[#fdf7ee] hover:bg-[#faede1]"
              }`}
            >
              <div className="truncate flex items-center gap-2 text-sm">
                💬 <span className="truncate">{c.title}</span>
              </div>
            </button>
          ))}
        </div>

       <div className="pt-4 border-t text-sm text-[#666] text-center">
  <button
    onClick={() => alert('Settings & Help Coming Soon!')}
    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdf7ee] hover:bg-[#e8d1a0] text-[#203c5b] font-medium transition shadow-sm"
  >
    <Settings className="w-4 h-4" />
    <span>Settings & Help</span>
  </button>
</div>

      </aside>

      {/* Main Chat Area */}
      <div className="relative flex-1 flex items-center justify-center bg-[#fdf7ee]">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/money.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

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
                  className="prose prose-sm max-w-none [&>a]:text-[#203c5b] [&>a:hover]:underline [&>button]:bg-[#fdf7ee] [&>button]:text-[#222] [&>svg]:stroke-[#203c5b]"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {!currentChat && (
              <div className="bg-white/90 rounded-2xl px-5 py-4 shadow-md max-w-[70%] text-left text-sm transition text-[#222]">
                👋 <strong>Welcome to GrahLaxmi....Your personalized Finchat ChatBot!</strong><br />
                I'm here to help you with finance tips, planning & questions.<br />
                Hit “New Chat” or ask your first question to begin!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-6 py-4 border-t bg-white flex items-center gap-3">
            <button onClick={() => alert('Voice input coming soon')} className="p-2 rounded-full bg-[#203c5b] text-white hover:bg-[#345272] transition">
              <Mic className="w-5 h-5" />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about income, scheme, goal..."
              className="flex-1 p-3 rounded-full border border-gray-300 bg-[#fdf7ee] text-[#222]"
            />
            <button onClick={handleSend} className="bg-[#203c5b] text-white p-3 rounded-full hover:bg-[#345272] transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
