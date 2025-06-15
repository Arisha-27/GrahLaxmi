"use client";
import dynamic from "next/dynamic";


const Chatbot = dynamic(() => import("@/app/components/chatbot"), {
  ssr: false,
});

export default function Home() {
  return <Chatbot />;
}
