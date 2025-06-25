"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "Is this app free?",
    a: "Yes! Grah Laxmi is 100% free and built to support your financial journey.",
  },
  {
    q: "Do I need a bank account?",
    a: "Not necessarily. We guide you even if you're just starting out.",
  },
  {
    q: "Will my data be safe?",
    a: "Yes — we use a secure PIN-based login and data is stored safely.",
  },
  {
    q: "Can I use this app in my local language?",
    a: "Absolutely! The app supports Hindi, Bengali, Tamil and many more languages.",
  },
  {
    q: "How do I get saving suggestions?",
    a: "Just select a goal like 'Start a Business' or 'Child’s Education' — we’ll give you a custom plan.",
  },
  {
    q: "Will I get reminders to save?",
    a: "Yes! We send monthly reminders and motivational messages to help you stay on track.",
  },
  {
    q: "Are the government schemes real?",
    a: "Yes — all schemes are verified and come from official government sources.",
  },
  {
    q: "Do I need to log in every time?",
    a: "No — you can access using a simple name or PIN, and your data stays saved securely.",
  },
  {
    q: "What if I don’t know how to use apps?",
    a: "No worries — the chatbot guides you step-by-step with simple questions and voice support.",
  },
  {
    q: "Can I use this app offline?",
    a: "Some features like saving progress and reminders may work offline — others sync once online.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-16 px-6 text-[#203C5B]" id="faqs">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Everything you need to know about using Grah Laxmi with confidence.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#FFF6EA] rounded-2xl shadow transition-all duration-200"
            >
              <button
                className="w-full flex justify-between items-center px-6 py-5 text-left text-lg font-semibold focus:outline-none"
                onClick={() => toggleFAQ(i)}
              >
                <span className="flex items-start gap-2">
                  <span className="text-[#203C5B]">Q{i + 1}.</span>
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-[#203C5B]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#203C5B]" />
                )}
              </button>

              <div
                className={`px-6 pb-5 text-gray-700 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="pt-1 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
