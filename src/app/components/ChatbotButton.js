'use client';

import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatbotButton() {
  const router = useRouter();

  const handleClick = () => {
    
    router.push('/chatbot');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#203c5b] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
      aria-label="Open Chatbot"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
}
