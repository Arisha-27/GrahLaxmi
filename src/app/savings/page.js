// import SavingsForm from "../components/SavingsForm";


// export default function SavingsPage() {
//   return (
//     <div className="min-h-screen bg-[#efe7e0] flex items-center justify-center px-4">
//       <div className="w-full max-w-xl">
//         <h1 className="text-xl font-bold   mt-3">Predict Your Monthly Savings</h1>
//         <SavingsForm />
//       </div>
//     </div>
//   );
// }


// import SavingsForm from "../components/SavingsForm";

// export default function SavingsPage() {
//   return (
//     <div className="min-h-screen bg-[#efe7e0] px-6 py-10">
//       <SavingsForm />
//     </div>
//   );
// }

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
