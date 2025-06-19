"use client";
import Image from "next/image";

const Header = () => {
  return (
    <nav className="flex justify-between items-center p-6 sm:p-8 bg-[#FFF7F4]">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
        <div>
          <h2 className="text-[#a61965] text-3xl font-semibold m-0">Grah Laxmi</h2>
          <small className="text-[#645757] text-xl font-semibold">#UdaanApneParoKi</small>
        </div>
      </div>

      {/* Right Side Navigation */}
      <ul className="flex gap-10 text-xl cursor-pointer text-black items-center">
        <li className="hover:text-[#a61965] hover:border-b-2 hover:border-[#a61965] hover:scale-110 transition-all duration-200">
          About Us
        </li>
        <li className="hover:text-[#a61965] hover:border-b-2 hover:border-[#a61965] hover:scale-110 transition-all duration-200">
          Contact Us
        </li>
        <li className="hover:text-[#a61965] hover:border-b-2 hover:border-[#a61965] hover:scale-110 transition-all duration-200">
          Our Services
        </li>

        {/* Smaller Language Dropdown */}
        <div className="relative">
          <select className="appearance-none border border-black px-4 py-2 rounded text-xl cursor-pointer w-[120px]">
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black text-lg">
            ▼
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default Header;







