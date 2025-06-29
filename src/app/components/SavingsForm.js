"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  GraduationCap,
  PiggyBank,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  Target,
  X,
} from "lucide-react";
import { getUserInfo } from "@/app/lib/userStore";

export default function SavingsModal({ isOpen, onClose }) {
  const router = useRouter();
  const { userEmail } = getUserInfo();

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

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

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
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [userEmail]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const validateField = (name, value) => {
    if (!value || value.toString().trim() === "") {
      return "This field is required.";
    }
    if (["income", "goal_amount", "duration_months"].includes(name) && +value <= 0) {
      return "Must be a positive number.";
    }
    if (name === "age" && (+value < 10 || +value > 100)) {
      return "Enter a valid age between 10 and 100.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return;

    const errors = {};
    Object.entries(formData).forEach(([key, val]) => {
      if (!["predicted_saving", "saved_till_now"].includes(key)) {
        const err = validateField(key, val);
        if (err) errors[key] = err;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

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
        onClose();
        router.refresh();
      } else {
        throw new Error(saveResult.error || "Save failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const fields = [
    {
      label: "Monthly Income",
      name: "income",
      placeholder: "₹ e.g. 30000",
      icon: Wallet,
      type: "number",
    },
    {
      label: "Goal Type",
      name: "goal_type",
      placeholder: "e.g. Education, Travel",
      icon: GraduationCap,
      type: "text",
      suggestions: ["Education", "Travel", "Wedding", "Emergency", "Home", "Vehicle"],
    },
    {
      label: "Goal Amount",
      name: "goal_amount",
      placeholder: "₹ e.g. 100000",
      icon: PiggyBank,
      type: "number",
    },
    {
      label: "Duration (in months)",
      name: "duration_months",
      placeholder: "e.g. 12",
      icon: CalendarDays,
      type: "number",
    },
    {
      label: "Age",
      name: "age",
      placeholder: "e.g. 25",
      icon: UserRound,
      type: "number",
    },
    {
      label: "Occupation",
      name: "occupation",
      placeholder: "e.g. Student, Engineer",
      icon: BriefcaseBusiness,
      type: "text",
      suggestions: ["Student", "Engineer", "Doctor", "Freelancer", "Teacher", "Self-employed"],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl mx-auto 
              bg-gradient-to-br from-[#fffaf3]/90 via-[#fef6ea]/90 to-[#fdf7ee]/90 
              backdrop-blur-2xl border border-[#f2c66d]/40 
              rounded-[2rem] shadow-[0_10px_40px_rgba(216,108,79,0.15)] 
              px-10 py-12 transition-all duration-300 ease-in-out"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#e28555] hover:text-[#b25a35] transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center gap-3 mb-8">
              <Target className="w-7 h-7 text-[#e28555]" />
              <h2 className="text-2xl font-bold text-[#222] tracking-tight">
                Predict Your Monthly Savings
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(({ label, name, placeholder, icon: Icon, type, suggestions }) => (
                  <div key={name} className="relative">
                    <label htmlFor={name} className="block text-sm font-medium text-[#666] mb-1">
                      {label}
                    </label>
                    <Icon className="w-5 h-5 absolute right-3 top-[42px] text-[#bbb]" />
                    <input
                      list={suggestions ? `${name}-suggestions` : undefined}
                      type={type}
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required
                      className={`w-full rounded-xl border px-4 py-3 pr-10 text-[#222] bg-white/90 focus:outline-none transition
                        ${formErrors[name]
                          ? "border-red-500 focus:ring-2 focus:ring-red-400"
                          : "border-[#ddd] focus:ring-2 focus:ring-[#e28555]"}`}
                    />
                    {formErrors[name] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[name]}</p>
                    )}
                    {suggestions && (
                      <datalist id={`${name}-suggestions`}>
                        {suggestions.map((item, i) => (
                          <option value={item} key={i} />
                        ))}
                      </datalist>
                    )}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-gradient-to-r from-[#e28555] via-[#f2bb6d] to-[#e28555] 
                  hover:from-[#d46c40] hover:via-[#f2b24d] hover:to-[#d46c40]
                  text-black text-lg py-3 rounded-xl font-semibold 
                  shadow-[0_4px_12px_rgba(226,133,85,0.3)] 
                  transition-all duration-300 ease-in-out"
              >
                Save / Update Goal
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
