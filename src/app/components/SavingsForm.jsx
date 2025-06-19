// ✅ SavingsForm.jsx (Full Updated Code)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SavingsForm = () => {
  const router = useRouter();
  const user_id = "aiman123"; // Hardcoded for now

  const [formData, setFormData] = useState({
    income: "",
    goal_type: "education",
    goal_amount: "",
    duration_months: "",
    age: "",
    location_type: "urban",
    digital_payment: "yes",
    shg_membership: "no",
    occupation: "",
    predicted_saving: null,
    saved_till_now: 0
  });

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user-data/${user_id}`);
        const data = await res.json();
        if (!data.error) {
          setFormData(prev => ({
            ...prev,
            goal_type: data.goal_type,
            goal_amount: data.goal_amount,
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

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      const saveRes = await fetch("http://127.0.0.1:5000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          predicted_saving: result.predicted_saving,
          user_id
        })
      });
      const saveResult = await saveRes.json();
      if (saveResult.status === "saved") {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6">
      <input
        type="number"
        name="income"
        placeholder="Monthly Income"
        value={formData.income}
        onChange={handleChange}
        className="border p-2 mb-3 w-full"
        required
      />
      <input
        type="text"
        name="goal_type"
        placeholder="Goal Type"
        value={formData.goal_type}
        onChange={handleChange}
        className="border p-2 mb-3 w-full"
        required
      />
      <input
        type="number"
        name="goal_amount"
        placeholder="Goal Amount"
        value={formData.goal_amount}
        onChange={handleChange}
        className="border p-2 mb-3 w-full"
        required
      />
      <input
        type="number"
        name="duration_months"
        placeholder="Duration (Months)"
        value={formData.duration_months}
        onChange={handleChange}
        className="border p-2 mb-3 w-full"
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="border p-2 mb-3 w-full"
        required
      />
      <input
        type="text"
        name="occupation"
        placeholder="Occupation"
        value={formData.occupation}
        onChange={handleChange}
        className="border p-2 mb-3 w-full"
        required
      />

      <button
        type="submit"
        className="bg-orange-600 text-white px-4 py-2 rounded w-full"
      >
        Save / Update Goal
      </button>
    </form>
  );
};

export default SavingsForm;