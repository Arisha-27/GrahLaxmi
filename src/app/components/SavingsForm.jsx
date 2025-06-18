'use client';
import { useState } from 'react';

export default function SavingsForm() {
  const [formData, setFormData] = useState({
    income: '',
    goal_type: '',
    goal_amount: '',
    duration_months: '',
    age: '',
    location_type: '',
    digital_payment: '',
    shg_membership: '',
    occupation: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch('/api/predict', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setResult(data.predicted_saving);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {[
        'income',
        'goal_type',
        'goal_amount',
        'duration_months',
        'age',
        'location_type',
        'digital_payment',
        'shg_membership',
        'occupation',
      ].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.replace('_', ' ')}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
      ))}

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Predicting...' : 'Predict Savings'}
      </button>

      {result !== null && (
        <div className="mt-4 text-green-600 font-medium">
          Recommended Monthly Saving: ₹{result}
        </div>
      )}
    </form>
  );
}
