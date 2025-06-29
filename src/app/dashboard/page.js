'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Doughnut, Line } from "react-chartjs-2";
import Sidebar from "@/app/components/Sidebar"; 
import { getUserInfo } from "@/app/lib/userStore";
import { BadgeCheck, Target, BarChart2, TrendingUp } from "lucide-react";
import SavingsModal from "@/app/components/SavingsForm";

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
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [userEmail, setUserEmail] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUserEmail(usr.email);
        const { userName, userEmail, userPhoto } = getUserInfo();
        setUserProfile({ userName, userEmail, userPhoto });
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user-data/${userEmail}`);
        if (!res.ok) throw new Error("User data fetch failed");

        const data = await res.json();
        setUser((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };

    fetchUser();
  }, [userEmail]);

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
        body: JSON.stringify({ user_id: userEmail, amount }),
      });

      const data = await res.json();
      if (data.status === "progress updated") {
        setStatusMsg("✅ Progress updated");
        amountRef.current.value = "";

        const refreshed = await fetch(`http://127.0.0.1:5000/user-data/${userEmail}`);
        const freshData = await refreshed.json();
        setUser((prev) => ({ ...prev, ...freshData }));
      } else {
        setStatusMsg("❌ Error updating progress");
      }
    } catch (err) {
      setStatusMsg("❌ Server error");
    }
  };

  const computedMonthsLeft =
    user.predicted_saving > 0
      ? Math.ceil((user.goal_amount - user.saved_till_now) / user.predicted_saving)
      : null;

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

  return (
    <div className="min-h-screen bg-[#fdf7ee] text-[#222] font-sans relative">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="pt-8 px-4 md:px-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-snug">
            Welcome, <span className="text-[#203C5B]">{userProfile.userName || user.name || "User"}</span>
          </h1>
          <p className="mt-3 text-base md:text-lg text-[#666] font-medium">
            Here’s your personalized <span className="text-[#e28555] font-semibold">financial goal</span> dashboard
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* 🎯 Current Goal */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 flex flex-col justify-between h-[520px] transition-all hover:shadow-2xl">
            <div className="text-2xl font-bold text-[#e28555] flex items-center justify-center gap-2 mb-3">
              <Target className="w-6 h-6" />
              Current Goal
            </div>
            <p className="text-sm text-center text-[#666] mb-3">
              To Save For <strong>{user.goal_type || "..."}</strong>
            </p>
            <div className="flex justify-center items-center flex-grow">
              <div className="w-[220px] h-[220px]">
                <Doughnut
                  data={{
                    labels: ["Completed", "Remaining"],
                    datasets: [
                      {
                        data: [user.goalProgress, 100 - user.goalProgress],
                        backgroundColor: ["#D86C4F", "#D8A39D"],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{ cutout: "72%", plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
            <div className="text-center mt-4 space-y-1">
              <p className="text-sm font-semibold text-[#222]">{user.goalProgress}% Complete</p>
              <p className="text-sm text-[#666]">₹{user.saved_till_now} saved of ₹{user.goal_amount}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-[#e28555] text-white mt-5 py-2 rounded-xl hover:bg-[#d46c40] transition font-semibold text-sm shadow-sm"
            >
              + Set / Edit Goal
            </button>
          </div>

          {/* 📅 Monthly Progress */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 flex flex-col justify-between h-[520px] transition-all hover:shadow-2xl">
            <div className="text-2xl font-bold text-[#e28555] flex items-center justify-center gap-2 mb-3">
              <BarChart2 className="w-6 h-6" />
              Monthly Progress
            </div>
            <div className="text-center space-y-2 text-sm text-[#555] mb-2">
              <p>
                <span className="font-medium text-[#222]">Predicted Saving:</span> ₹{user.predicted_saving}
              </p>
              <p>
                <span className="font-medium text-[#222]">Remaining to Goal:</span> ₹{user.goal_amount - user.saved_till_now}
              </p>
              <p>
                <span className="font-medium text-[#222]">Estimated Months Left:</span>{" "}
                <strong>{computedMonthsLeft || "N/A"}</strong>
              </p>
            </div>

            <div className="flex justify-center items-center mt-4 h-[110px]">
              <div className="w-[180px] h-[100px]">
                <Doughnut data={halfDonutData} options={halfDonutOptions} />
              </div>
            </div>

            <p className="text-green-600 text-sm text-center mt-2 flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Keep going! You're making progress!</span>
            </p>

            <div className="w-full mt-5">
              <input
                ref={amountRef}
                type="number"
                placeholder="Enter amount"
                className="p-2 border border-[#ddd] rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#e28555] text-sm"
              />
              <button
                onClick={handleSaveProgress}
                className="w-full mt-3 bg-[#e28555] text-white py-2 rounded-xl hover:bg-[#d46c40] transition font-semibold text-sm shadow-sm"
              >
                Save Progress
              </button>
              {statusMsg && (
                <p className="text-sm text-center text-[#e28555] mt-2">{statusMsg}</p>
              )}
            </div>
          </div>

          {/* 📈 Weekly Trend */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 flex flex-col h-[520px] transition-all hover:shadow-2xl">
            <div className="text-2xl font-bold text-[#e28555] flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6" />
              Weekly Saving Trend
            </div>
            <div className="flex-grow w-full">
              <div className="relative h-full">
                <Line data={weeklyTrendData} options={weeklyTrendOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Correct placement of modal outside layout */}
      {showModal && (
        <SavingsModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
