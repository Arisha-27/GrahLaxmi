'use client';

import { useState } from "react";

export default function SchemeForm() {
  const ageRanges = [
    { label: "Below 18", min: 0, max: 17 },
    { label: "18 – 25", min: 18, max: 25 },
    { label: "26 – 40", min: 26, max: 40 },
    { label: "41 – 60", min: 41, max: 60 },
    { label: "60+ (Senior)", min: 61, max: 120 },
    { label: "All Ages", min: 0, max: 120 },
  ];

  // ✅ Move these OUTSIDE handleSubmit
  const casteOptions = [
    "sc", "st", "obc", "ews", "general", "bc", "sebc", "vjnt", "sbc", "minority", "parsi", "all"
  ];
  const statusOptions = [
    "student", "disabled", "farmer", "widow", "pregnant", "unorganized_worker", "entrepreneur",
    "woman", "artist", "exservicemen", "government", "orphan", "elderly", "journalist", "ews", "low_income"
  ];

  const [formData, setFormData] = useState({
    DBT: "",
    Economic_Distress: "",
    min_age: "",
    max_age: "",
    age_group: "",
    income_upper_limit: "",
    caste: "",
    status: "",
    income_category: "",
    sub_categories: "",
    primary_category: "",
    Residence_Cleaned: "",
    Minority_Cleaned: "",
    Disability_Cleaned: "",
    Benefit_Category: "",
    Marital_Status_Clean: "",
    BPL_Clean: "",
    Employment_Status_Clean: "",
    Application_Mode_Clean: "",
    Scheme_Type_Clean: "",
    Location_Clean: ""
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAgeGroupChange = (e) => {
    const selected = ageRanges.find(a => a.label === e.target.value);
    if (selected) {
      setFormData({
        ...formData,
        age_group: selected.label,
        min_age: selected.min,
        max_age: selected.max
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFormData = { ...formData };

    casteOptions.forEach(c => {
      newFormData[`caste_${c}`] = formData.caste === c ? 1 : 0;
    });
    statusOptions.forEach(s => {
      newFormData[`is_${s}`] = formData.status === s ? 1 : 0;
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFormData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("API Response:", data);
      setResult(data.predicted_scheme || "No match found");
    } catch (error) {
      console.error("Prediction error:", error);
      setResult("⚠️ Error predicting scheme. Please try again.");
    }
  };

  const renderDropdown = (label, name, options) => (
    <div className="w-full">
      <label className="block text-gray-800 font-semibold mb-1">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full bg-white border border-gray-600 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-700 
          ${formData[name] ? "text-gray-900" : "text-gray-400"}`}
      >
        <option value="">-- Select {label} --</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        🏛️ Government Scheme Finder
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <label className="block text-gray-800 font-semibold mb-1">Age Group</label>
          <select
            name="age_group"
            value={formData.age_group}
            onChange={handleAgeGroupChange}
            className={`w-full bg-white border border-gray-600 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-700 
              ${formData.age_group ? "text-gray-900" : "text-gray-400"}`}
          >
            <option value="">-- Select Age Group --</option>
            {ageRanges.map(group => (
              <option key={group.label} value={group.label}>{group.label}</option>
            ))}
          </select>
        </div>

        {renderDropdown("Income Limit", "income_upper_limit", [0, 50000, 100000, 200000, 300000])}
        {renderDropdown("Caste", "caste", casteOptions)}
        {renderDropdown("Status / Identity", "status", statusOptions)}
        {renderDropdown("DBT", "DBT", ["Yes", "No"])}
        {renderDropdown("Economic Distress", "Economic_Distress", ["Yes", "No"])}
        {renderDropdown("Income Category", "income_category", ["Low", "Middle", "High"])}
        {renderDropdown("Sub Category", "sub_categories", ["Education", "Livelihood", "Welfare"])}
        {renderDropdown("Primary Category", "primary_category", ["Student", "Farmer", "Entrepreneur", "Other"])}
        {renderDropdown("Residence", "Residence_Cleaned", ["Urban", "Rural"])}
        {renderDropdown("Minority", "Minority_Cleaned", ["Yes", "No"])}
        {renderDropdown("Disability", "Disability_Cleaned", ["Yes", "No"])}
        {renderDropdown("Benefit Type", "Benefit_Category", ["Financial", "In Kind", "Other"])}
        {renderDropdown("Marital Status", "Marital_Status_Clean", ["Single", "Married", "Widowed"])}
        {renderDropdown("BPL", "BPL_Clean", ["Yes", "No"])}
        {renderDropdown("Employment Status", "Employment_Status_Clean", ["Student", "Unemployed", "Employed"])}
        {renderDropdown("Application Mode", "Application_Mode_Clean", ["Online", "Offline"])}
        {renderDropdown("Scheme Type", "Scheme_Type_Clean", ["State", "Central"])}
        {renderDropdown("Location", "Location_Clean", ["Kerala", "Delhi", "Uttar Pradesh", "Maharashtra", "Other"])}

        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md shadow hover:bg-blue-700 transition duration-300 text-lg font-semibold"
          >
            🔍 Predict Scheme
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-900 rounded-md text-center">
          <p className="text-lg font-medium">🎯 Recommended Scheme:</p>
          <p className="text-xl font-bold mt-2">{result}</p>
        </div>
      )}
    </div>
  );
}
