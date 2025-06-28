"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  AcademicCapIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { getUserInfo } from "@/app/lib/userStore"; // ✅ Get user info

const SavingsForm = () => {
  const router = useRouter();
  const { userEmail } = getUserInfo(); // ✅ use email as UID

  const [formData, setFormData] = useState({
    income: "",
    goal_type: "",
    goal_amount: "",
    duration_months: "",
    age: "",
    occupation: "",
    predicted_saving: null,
    saved_till_now: 0,
  });

  // ✅ Fetch goal data from backend if available
  useEffect(() => {
    if (!userEmail) return; // avoid fetch until user is set

    const fetchExistingData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user-data/${userEmail}`);
        const data = await res.json();
        if (!data.error) {
          setFormData((prev) => ({
            ...prev,
            predicted_saving: data.predicted_saving,
            saved_till_now: data.saved_till_now,
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchExistingData();
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const predictionPayload = {
      income: formData.income,
      goal_type: formData.goal_type,
      goal_amount: formData.goal_amount,
      duration_months: formData.duration_months,
      age: formData.age,
      occupation: formData.occupation,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(predictionPayload),
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      const savePayload = {
        ...predictionPayload,
        predicted_saving: result.predicted_saving,
        saved_till_now: formData.saved_till_now || 0,
        user_id: userEmail,
      };

      const saveRes = await fetch("http://127.0.0.1:5000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savePayload),
      });

      const saveResult = await saveRes.json();
      if (saveResult.status === "saved") {
        router.push("/dashboard");
      } else {
        throw new Error(saveResult.error || "Save failed");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f0] to-[#efe7e0] px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl px-10 py-12 w-full max-w-xl border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-[#805936] mb-10">
          🎯 Predict Your Monthly Savings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Monthly Income",
              name: "income",
              placeholder: "₹ e.g. 30000",
              icon: CurrencyRupeeIcon,
              type: "number",
            },
            {
              label: "Goal Type",
              name: "goal_type",
              placeholder: "e.g. Education, Travel",
              icon: AcademicCapIcon,
              type: "text",
            },
            {
              label: "Goal Amount",
              name: "goal_amount",
              placeholder: "₹ e.g. 100000",
              icon: CurrencyRupeeIcon,
              type: "number",
            },
            {
              label: "Duration (in months)",
              name: "duration_months",
              placeholder: "e.g. 12",
              icon: CalendarIcon,
              type: "number",
            },
            {
              label: "Age",
              name: "age",
              placeholder: "e.g. 25",
              icon: UserIcon,
              type: "number",
            },
            {
              label: "Occupation",
              name: "occupation",
              placeholder: "e.g. Student, Engineer",
              icon: BriefcaseIcon,
              type: "text",
            },
          ].map(({ label, name, placeholder, icon: Icon, type }) => (
            <div key={name} className="flex flex-col relative">
              <label htmlFor={name} className="text-sm font-medium mb-1 pl-1">
                {label}
              </label>
              <Icon className="w-5 h-5 absolute right-4 top-11 text-gray-400" />
              <input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                required
              />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="mt-10 w-full bg-[#203c5b] hover:bg-[#203c5bd0] text-white px-8 py-4 rounded-lg text-base sm:text-lg font-semibold shadow-lg transition duration-300"
        >
          Save / Update Goal
        </motion.button>
      </motion.form>
    </div>
  );
};

export default SavingsForm;
