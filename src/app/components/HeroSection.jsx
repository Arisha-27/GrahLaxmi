"use client";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between px-8 sm:px-24 py-12 sm:py-20 relative overflow-hidden bg-[#FFF5F5]">

      {/* Left Content */}
      <div className="max-w-2xl text-center sm:text-left sm:ml-20 flex flex-col justify-center sm:-mt-32">
        <h1 className="text-[52px] sm:text-[72px] font-bold text-[#a61965] leading-tight mb-3">
          Empowering <br /> Women to <br /> Grow Wealth
        </h1>
        <p className="text-[#645757] text-[28px] sm:text-[30px] mb-5 leading-relaxed">
          Join us in building a future where <br />
          women thrive financially on <br />
          their own terms.
        </p>
        <button className="bg-[#d9534f] text-white font-bold px-[32px] py-[16px] text-[20px] rounded hover:bg-[#c7433f] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out self-center sm:self-start">
  Get Started
</button>

      </div>

      {/* Right Image with Blob Background */}
      <div className="relative mt-12 sm:mt-0 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] flex items-center justify-center">
        {/* Blob Background */}
        <div
          className="absolute w-[900px] h-[900px] sm:w-[1100px] sm:h-[1100px] bg-no-repeat bg-center z-0"
          style={{ backgroundImage: "url('/blob.svg')", backgroundSize: 'cover' }}
        ></div>

        {/* Woman Image */}
        <Image
          src="/woman-plant.png"
          alt="Woman Growing Wealth"
          width={490}
          height={490}
          className="relative z-10"
        />
      </div>
    </div>
  );
};

export default HeroSection;












