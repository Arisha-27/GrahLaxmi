import { Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { footer } from "@/data/data";

export const Footer = () => (
  <footer className="bg-[#f9f3ee] text-gray-700 py-8 px-6 md:px-16">
    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">

      {/* 🏢 Brand Left Side */}
      <div className="flex items-center gap-3 text-lg font-semibold">
        <Image
          src="/icons/logo.png"
          alt="GrahaLaxmi Logo"
          width={50}
          height={50}
        />
        {footer.companyName}
      </div>

      {/* 📧 Email */}
      <div className="flex items-center gap-3 text-sm">
        <Mail className="w-4 h-4 text-gray-600" />
        <a href={`mailto:${footer.email}`} className="hover:underline">
          {footer.email}
        </a>
      </div>

      {/* 🛡️ Copyright */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <ShieldCheck className="w-4 h-4 text-gray-400" />
        {footer.copyright}
      </div>
      
    </div>
  </footer>
);
