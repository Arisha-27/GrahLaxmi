
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BriefcaseIcon, CalendarIcon, CurrencyRupeeIcon, AcademicCapIcon, UserIcon } from "@heroicons/react/24/outline";
const SavingsForm = () => {
  const router = useRouter();

  const [userId, setUserId] = useState(null);

const [formData, setFormData] = useState({
  income: "",
  goal_type: "",
  goal_amount: "",
  duration_months: "",
  age: "",
  occupation: "",
  predicted_saving: null,
  saved_till_now: 0
});


  // ✅ Load user ID and fetch existing goal if present
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      alert("User not logged in!");
      router.push("/");
      return;
    }
    setUserId(uid);

    const fetchExistingData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user-data/${uid}`);
        const data = await res.json();
        if (!data.error) {
          setFormData(prev => ({
            ...prev,
            predicted_saving: data.predicted_saving,
            saved_till_now: data.saved_till_now
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchExistingData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   try {
  //     // Step 1: Predict saving
  //     const res = await fetch("http://127.0.0.1:5000/predict", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData)
  //     });
  //     const result = await res.json();

  //     // Step 2: Save form with prediction and user ID
  //     const saveRes = await fetch("http://127.0.0.1:5000/save", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...formData,
  //         predicted_saving: result.predicted_saving,
  //         user_id: userId
  //       })
  //     });

  //     const saveResult = await saveRes.json();
  //     if (saveResult.status === "saved") {
  //       router.push("/dashboard");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // };

  const handleSubmit = async e => {
  e.preventDefault();

  const predictionPayload = {
    income: formData.income,
    goal_type: formData.goal_type,
    goal_amount: formData.goal_amount,
    duration_months: formData.duration_months,
    age: formData.age,
    occupation: formData.occupation
  };

  try {
    // Step 1: Predict
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(predictionPayload)
    });
    const result = await res.json();
    if (result.error) {
      throw new Error(result.error);
    }

    // Step 2: Save
    const savePayload = {
      ...predictionPayload,
      predicted_saving: result.predicted_saving,
      saved_till_now: formData.saved_till_now || 0,
      user_id: userId
    };

    const saveRes = await fetch("http://127.0.0.1:5000/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(savePayload)
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
  <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-[#f8f4f0] to-[#efe7e0] px-4">
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
        {/* Monthly Income */}
        <div className="flex flex-col relative">
          <label htmlFor="income" className="text-sm font-medium mb-1 pl-1">Monthly Income</label>
          <CurrencyRupeeIcon className="w-5 h-5 absolute right-4 top-11 text-gray-400" />
          <input
            type="number"
            name="income"
            id="income"
            placeholder="₹ e.g. 30000"
            value={formData.income}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        {/* Goal Type */}
        <div className="flex flex-col relative">
          <label htmlFor="goal_type" className="text-sm font-medium mb-1 pl-1">Goal Type</label>
          <AcademicCapIcon className="w-5 h-5 absolute right-4 top-11 text-gray-400" />
          <input
            type="text"
            name="goal_type"
            id="goal_type"
            placeholder="e.g. Education, Travel"
            value={formData.goal_type}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        {/* Goal Amount */}
        <div className="flex flex-col relative">
          <label htmlFor="goal_amount" className="text-sm font-medium mb-1 pl-1">Goal Amount</label>
          <CurrencyRupeeIcon className="w-5 h-5 absolute right-4 top-11 text-gray-400" />
          <input
            type="number"
            name="goal_amount"
            id="goal_amount"
            placeholder="₹ e.g. 100000"
            value={formData.goal_amount}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col relative">
          <label htmlFor="duration_months" className="text-sm font-medium mb-1 pl-1">Duration (in months)</label>
          <CalendarIcon className="w-5 h-5 absolute right-4 top-11 text-gray-400" />
          <input
            type="number"
            name="duration_months"
            id="duration_months"
            placeholder="e.g. 12"
            value={formData.duration_months}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        {/* Age */}
        <div className="flex flex-col relative">
          <label htmlFor="age" className="text-sm font-medium mb-1 pl-1">Age</label>
          <UserIcon className="w-5 h-5 absolute right-4 top-11 text-gray-400" />
          <input
            type="number"
            name="age"
            id="age"
            placeholder="e.g. 25"
            value={formData.age}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        {/* Occupation */}
        <div className="flex flex-col relative">
          <label htmlFor="occupation" className="text-sm font-medium mb-1 pl-1">Occupation</label>
          <BriefcaseIcon className="w-5 h-5 absolute right-4 top-11 text-gray-400" />
          <input
            type="text"
            name="occupation"
            id="occupation"
            placeholder="e.g. Student, Engineer"
            value={formData.occupation}
            onChange={handleChange}
            className="rounded-xl border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>
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
