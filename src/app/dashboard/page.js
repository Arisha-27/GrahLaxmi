'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Doughnut, Line } from "react-chartjs-2";
import { getUserInfo } from "@/app/lib/userStore";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

// ✅ Register chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

export default function DashboardPage() {
  const router = useRouter();
  const amountRef = useRef(null);

  const [uid, setUid] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const [user, setUser] = useState({
    name: "User",
    goalProgress: 0,
    goal_type: "",
    goal_amount: 0,
    predicted_saving: 0,
    saved_till_now: 0,
    totalMonths: null,
    weeklySavings: [0, 0, 0, 0],
  });

  const [userProfile, setUserProfile] = useState({
    userName: "",
    userEmail: "",
    userPhoto: "",
  });

  // ✅ Firebase Auth + User Info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUid(usr.uid);
        const { userName, userEmail, userPhoto } = getUserInfo();
        setUserProfile({ userName, userEmail, userPhoto });
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ Fetch user data (corrected endpoint)
  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user-data/${uid}`);
        if (!res.ok) {
          console.error("User data fetch failed:", res.status);
          throw new Error("Fetch error");
        }

        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };

    fetchUser();
  }, [uid]);

  // ✅ Update progress
  const handleSaveProgress = async () => {
    const amount = parseFloat(amountRef.current?.value);
    if (!amount || amount <= 0) {
      setStatusMsg("❌ Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid, amount }),
      });

      const data = await res.json();
      if (data.status === "progress updated") {
        setStatusMsg("✅ Progress updated");
        amountRef.current.value = "";

        // Refetch user data after update
        const refreshed = await fetch(`http://127.0.0.1:5000/user-data/${uid}`);
        const freshData = await refreshed.json();
        setUser((prev) => ({ ...prev, ...freshData }));
      } else {
        setStatusMsg("❌ Error updating progress");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Server error");
    }
  };

  const computedMonthsLeft =
    user.predicted_saving > 0
      ? Math.ceil((user.goal_amount - user.saved_till_now) / user.predicted_saving)
      : null;

  // ✅ Donut Chart: Goal Progress
  const donutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [user.goalProgress, 100 - user.goalProgress],
        backgroundColor: ["#8B4513", "#f3f3f3"],
        borderWidth: 0,
      },
    ],
  };

  const halfDonutData = {
    labels: ["Months Left", "Completed"],
    datasets: [
      {
        data: [
          computedMonthsLeft ?? 0,
          Math.max(0, (user.totalMonths ?? 0) - (computedMonthsLeft ?? 0)),
        ],
        backgroundColor: ["#8B4513", "#f3f3f3"],
        borderWidth: 0,
      },
    ],
  };

  const halfDonutOptions = {
    cutout: "70%",
    rotation: -90,
    circumference: 180,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  const weeklyTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Savings",
        data: user.weeklySavings,
        borderColor: "#8B4513",
        backgroundColor: "#8B4513",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const weeklyTrendOptions = {
    plugins: {
      legend: { labels: { color: "#8B4513" } },
    },
    scales: {
      x: { ticks: { color: "#8B4513" } },
      y: { ticks: { color: "#8B4513" }, beginAtZero: true },
    },
    maintainAspectRatio: false,
  };

  // ✅ Final UI
  return (
    <div className="min-h-screen bg-[#fff8f2] p-4 text-[#4e342e]">
      <h1 className="text-center text-5xl font-extrabold mb-2" style={{ color: "#8B4513" }}>
        Welcome, {userProfile.userName || user.name || "User"}
      </h1>
      <p className="text-center text-sm mb-8 text-[#6b4c3b]">
        Here's your financial goal overview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-start">
        {/* 🎯 Current Goal */}
        <div className="bg-[#fff0e0] rounded-2xl shadow-md p-6 flex flex-col items-center h-[520px] justify-between">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#8B4513] mb-2">🎯 Current Goal</h2>
            <p className="mb-2">To Save For {user.goal_type || "..."}</p>
            <div className="w-60 h-60">
              <Doughnut data={donutData} options={{ cutout: "70%" }} />
            </div>
            <div className="text-center mt-[-10px]">
              <p className="text-sm font-semibold text-[#8B4513]">{user.goalProgress}% Complete</p>
              <p className="text-sm">
                ₹{user.saved_till_now} saved of ₹{user.goal_amount}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/savings")}
            className="w-full bg-[#d64b3d] text-white mt-4 py-2 rounded-lg hover:bg-[#a93e34]"
          >
            + Set / Edit Goal
          </button>
        </div>

        {/* 📊 Monthly Progress */}
        <div className="bg-[#fff0e0] rounded-2xl shadow-md p-6 flex flex-col items-center h-[520px] justify-between">
          <div className="text-center w-full">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4">📊 Monthly Progress</h2>
            <p>Predicted Saving: ₹{user.predicted_saving}</p>
            <p>Remaining to Goal: ₹{user.goal_amount - user.saved_till_now}</p>
            <p>
              Estimated Months Left: <strong>{computedMonthsLeft || "N/A"}</strong>
            </p>
            <div className="w-48 h-28 mt-4 mb-2 mx-auto">
              <Doughnut data={halfDonutData} options={halfDonutOptions} />
            </div>
            <p className="text-green-600 text-sm mt-2">
              🚀 Keep going! You are making progress!
            </p>
          </div>
          <div className="w-full mt-4">
            <input
              ref={amountRef}
              type="number"
              placeholder="Enter amount"
              className="mt-2 p-2 border rounded w-full"
            />
            <button
              onClick={handleSaveProgress}
              className="w-full mt-3 bg-[#d64b3d] text-white py-2 rounded-lg hover:bg-[#a93e34]"
            >
              Save Progress
            </button>
            {statusMsg && (
              <p className="text-sm text-center text-[#8B4513] mt-2">{statusMsg}</p>
            )}
          </div>
        </div>

        {/* 📈 Weekly Trend */}
        <div className="bg-[#fff0e0] rounded-2xl shadow-md p-6 flex flex-col items-center h-[520px]">
          <h2 className="text-xl font-bold text-[#8B4513] mb-4">📈 Weekly Saving Trend</h2>
          <div className="w-full h-[320px]">
            <Line data={weeklyTrendData} options={weeklyTrendOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
