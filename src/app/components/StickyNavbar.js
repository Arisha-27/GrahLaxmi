"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const StickyNavbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [activeTab, setActiveTab] = useState('About Us');
  const router = useRouter();

  const handleJoinClick = () => {
    router.push('/waitlist');
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showNavbar) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b-2 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-12 h-24 flex items-center justify-between relative">

        {/* 🌟 Brand Left Side */}
        <div className="flex items-center gap-3 text-3xl font-bold text-[#203c5b]">
          <Image
            src="/icons/logo.png"
            alt="GrahaLaxmi Logo"
            width={82}
            height={82}
          />
          <span>
            Graha<span className="italic text-[#203c5b]">Laxmi</span>
          </span>
        </div>

        {/* 🧭 Center: Tabs (now in one line, no wrapping) */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex gap-6 bg-orange-50 px-6 py-3 rounded-full text-lg text-gray-700 font-semibold shadow-inner whitespace-nowrap">
            {[
              { label: 'Our Services', id: 'services' },
              { label: 'FAQs', id: 'faqs' },
              { label: 'Contact Us', id: 'contact' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => {
                  const section = document.getElementById(id);
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                  setActiveTab(label);
                }}
                className={`px-5 py-2 rounded-full transition shadow-sm ${
                  activeTab === label
                    ? 'bg-white text-[#203c5b]'
                    : 'hover:text-[#203c5b]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 🎯 CTA Button Right Side */}
        <button
          onClick={handleJoinClick}
          className="bg-[#0D2645] text-white text-xl px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default StickyNavbar;
