

"use client";
import { motion } from "framer-motion";
import SavingsForm from "../components/SavingsForm";

export default function SavingsPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#f8f4f0] to-[#efe7e0] flex items-center justify-center">
      <motion.div
        whileHover={{
          scale: 1.015,
          transition: { type: "spring", stiffness: 120, damping: 12 },
        }}
        className="w-full max-w-xl"
      >
        <SavingsForm />
      </motion.div>
    </div>
  );
}
