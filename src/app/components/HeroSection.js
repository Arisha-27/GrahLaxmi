'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HandCoins } from 'lucide-react';
import { heroTexts } from '@/data/data';

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  const handleJoinClick = () => {
    router.push('/waitlist');
  };

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % heroTexts.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#D5C7BB]">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
        <Image
          src="/hero-image.jpg"
          alt="Empowered women smiling"
          fill
          className="object-cover object-[center_-50%]"

          priority
        />
        {/* Gentle overlay from bottom */}
       <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FFFEFC] via-[#FFFEFC]/60 to-transparent z-20 pointer-events-none" />

      </div>

      {/* Brand */}

<div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2">
  <HandCoins className="w-6 h-6 text-[#203c5b]" />
  <h1 className="text-3xl font-bold text-[#203c5b] tracking-wide font-serif">
    Grah<span className="text-[#203c5b] italic">Laxmi</span>
  </h1>
</div>


      {/* Hero Text */}
      <div
        className={`absolute top-[18%] left-1/2 transform -translate-x-1/2 z-30 w-[90%] max-w-3xl text-center ${
          fade ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A2E18] mb-4">
          {heroTexts[index].heading}
        </h2>
        <p className="text-lg sm:text-m text-gray-700 font-medium leading-relaxed">
          {heroTexts[index].subheading}
        </p>
      </div>

      {/* CTA Button */}
      <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={handleJoinClick}
          className="bg-[#203c5b] hover:bg-[#203c5bd0] text-white px-8 py-4 rounded-lg text-base sm:text-lg font-semibold shadow-md transition"
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
