// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";

// const Dashboard = () => {
//   const router = useRouter();
//   const amountRef = useRef();
//   const [updateStatus, setUpdateStatus] = useState("");
//   const [user, setUser] = useState({
//     name: "Aiman",
//     goalProgress: 0,
//     goal_type: "",
//     goal_amount: 0,
//     predicted_saving: 0,
//     saved_till_now: 0,
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:5000/user-data/aiman123");
//         const data = await res.json();
//         setUser((prev) => ({
//           ...prev,
//           goalProgress: data.goalProgress,
//           goal_type: data.goal_type,
//           goal_amount: data.goal_amount,
//           predicted_saving: data.predicted_saving,
//           saved_till_now: data.saved_till_now,
//         }));
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleSaveProgress = async () => {
//     const amount = parseFloat(amountRef.current.value);
//     if (!amount || amount <= 0) {
//       setUpdateStatus("❌ Please enter a valid amount");
//       return;
//     }

//     const res = await fetch("http://127.0.0.1:5000/update-progress", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user_id: "aiman123", // update with real user ID logic
//         amount: amount,
//       }),
//     });

//     const data = await res.json();
//     if (data.status === "progress updated") {
//       setUpdateStatus("✅ Progress updated");
//       amountRef.current.value = "";
//       const refreshed = await fetch("http://127.0.0.1:5000/user-data/aiman123");
//       const freshData = await refreshed.json();
//       setUser((prev) => ({
//         ...prev,
//         goalProgress: freshData.goalProgress,
//         saved_till_now: freshData.saved_till_now,
//       }));
//     } else {
//       setUpdateStatus("❌ Error updating progress");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFF6F3] text-gray-800 p-6">
//       <h1 className="text-3xl font-bold mb-8 text-[#940000]">
//         Welcome, {user.name}!
//       </h1>

//       <div className="flex flex-col gap-6">
//         {/* Goal Tracker */}
//         <div className="bg-[#FCDDD2] shadow-md rounded-xl p-5">
//           <h2 className="text-lg font-semibold mb-1">🎯 Your Current Goal</h2>

//           {user.goal_amount === 0 ? (
//             <p className="text-sm text-gray-600">No goal set yet</p>
//           ) : (
//             <>
//               <p className="text-sm mb-1">{user.goal_type}</p>
//               <div className="w-full bg-[#F9C6B4] rounded-full h-3 mb-2">
//                 <div
//                   className="bg-[#CC5A41] h-3 rounded-full"
//                   style={{ width: `${user.goalProgress}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm">{user.goalProgress}% completed</p>
//               <p className="text-sm mt-1">
//                 Saved ₹{user.saved_till_now} of ₹{user.goal_amount}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Recommended Monthly Saving: ₹{user.predicted_saving}
//               </p>
//             </>
//           )}

//           <button
//             className="mt-3 w-full bg-[#CC5A41] hover:bg-[#B24B36] text-white py-2 px-4 rounded-lg"
//             onClick={() => router.push("/savings")}
//           >
//             + Set / Manage Goals
//           </button>

//           {/* Update saved amount section */}
//           <div className="mt-4">
//             <label className="block mb-1 text-sm font-medium">
//               Update Saved Amount:
//             </label>
//             <input
//               type="number"
//               ref={amountRef}
//               className="w-full p-2 border rounded-md text-sm"
//               placeholder="Enter amount"
//             />
//             <button
//               className="mt-2 w-full bg-[#CC5A41] hover:bg-[#B24B36] text-white py-2 px-4 rounded-lg"
//               onClick={handleSaveProgress}
//             >
//               Save Progress
//             </button>
//             {updateStatus && (
//               <p className="text-xs text-gray-700 mt-2">{updateStatus}</p>
//             )}
//           </div>
//         </div>

//         {/* Govt Schemes */}
//         <div className="bg-[#FFE8DF] shadow-md rounded-xl p-5">
//           <h2 className="text-lg font-semibold mb-1">🏛️ Recommended Schemes</h2>
//           <ul className="list-disc list-inside text-sm space-y-1">
//             <li>MUDRA Yojana - Micro business loan</li>
//             <li>PM Sukanya Samriddhi - For girl child</li>
//             <li>Stand-Up India - For women entrepreneurs</li>
//           </ul>
//           <button
//             className="mt-3 w-full bg-[#CC5A41] hover:bg-[#B24B36] text-white py-2 px-4 rounded-lg"
//             onClick={() => router.push("/schemes")}
//           >
//             View All Schemes
//           </button>
//         </div>

//         {/* Chatbot */}
//         <div className="bg-[#FFE3D5] shadow-md rounded-xl p-5">
//           <h2 className="text-lg font-semibold mb-1">💬 Chat with AI Assistant</h2>
//           <p className="text-sm mb-3">
//             Ask about goals, savings, or suitable schemes.
//           </p>
//           <button
//             className="w-full bg-[#CC5A41] hover:bg-[#B24B36] text-white py-2 px-4 rounded-lg"
//             onClick={() => router.push("/chat")}
//           >
//             Open Chatbot
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";

// const Dashboard = () => {
//   const router = useRouter();
//   const amountRef = useRef();
//   const [updateStatus, setUpdateStatus] = useState("");
//   const [mounted, setMounted] = useState(false);
//   const [uid, setUid] = useState(null);
//   const [user, setUser] = useState({
//     name: "User",
//     goalProgress: 0,
//     goal_type: "",
//     goal_amount: 0,
//     predicted_saving: 0,
//     saved_till_now: 0,
//   });

//   // ✅ Defer hydration till client-side
//   useEffect(() => {
//     setMounted(true);
//     const storedUid = localStorage.getItem("uid");
//     if (!storedUid) {
//       router.push("/login");
//     } else {
//       setUid(storedUid);
//     }
//   }, []);

//   useEffect(() => {
//     if (!uid) return;
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`http://127.0.0.1:5000/user-data/${uid}`);
//         const data = await res.json();
//         setUser((prev) => ({
//           ...prev,
//           name: data.name || "User",
//           goalProgress: data.goalProgress || 0,
//           goal_type: data.goal_type || "",
//           goal_amount: data.goal_amount || 0,
//           predicted_saving: data.predicted_saving || 0,
//           saved_till_now: data.saved_till_now || 0,
//         }));
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//       }
//     };
//     fetchUser();
//   }, [uid]);

//   const handleSaveProgress = async () => {
//     const amount = parseFloat(amountRef.current.value);
//     if (!amount || amount <= 0) {
//       setUpdateStatus("❌ Please enter a valid amount");
//       return;
//     }

//     const res = await fetch("http://127.0.0.1:5000/update-progress", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user_id: uid,
//         amount: amount,
//       }),
//     });

//     const data = await res.json();
//     if (data.status === "progress updated") {
//       setUpdateStatus("✅ Progress updated");
//       amountRef.current.value = "";
//       const refreshed = await fetch(`http://127.0.0.1:5000/user-data/${uid}`);
//       const freshData = await refreshed.json();
//       setUser((prev) => ({
//         ...prev,
//         goalProgress: freshData.goalProgress,
//         saved_till_now: freshData.saved_till_now,
//       }));
//     } else {
//       setUpdateStatus("❌ Error updating progress");
//     }
//   };

//   if (!mounted || !uid) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#d8b4fe] via-[#c084fc] to-[#a855f7] text-gray-800 p-6">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold mb-10 text-center text-blue-800">
//           Welcome, {user.name}!
//         </h1>

//         <div className="flex flex-col gap-8">
//           {/* Goal Tracker */}
//           <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
//             <h2 className="text-xl font-semibold mb-2 text-blue-700">
//               🎯 Your Current Goal
//             </h2>

//             {user.goal_amount === 0 || user.goal_type === "" ? (
//               <>
//                 <p className="text-md text-gray-600">🕵️‍♀️ You haven't set a goal yet.</p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Click the button below to set your financial goal.
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p className="text-md font-medium text-gray-700 capitalize">
//                   {user.goal_type}
//                 </p>
//                 <div className="w-full bg-blue-100 rounded-full h-3 my-3">
//                   <div
//                     className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-in-out"
//                     style={{ width: `${user.goalProgress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   {user.goalProgress}% completed
//                 </p>
//                 <p className="text-sm text-gray-700 mt-1">
//                   Saved ₹{user.saved_till_now} of ₹{user.goal_amount}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   📌 Recommended Monthly Saving: ₹{user.predicted_saving}
//                 </p>
//               </>
//             )}

//             <button
//               className="mt-4 w-full bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-semibold"
//               onClick={() => router.push("/savings")}
//             >
//               + Set / Manage Goals
//             </button>

//             {/* Update saved amount section */}
//             {user.goal_amount > 0 && (
//               <div className="mt-6">
//                 <label className="block mb-1 text-sm font-medium text-gray-700">
//                   Add to Saved Amount
//                 </label>
//                 <input
//                   type="number"
//                   ref={amountRef}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//                   placeholder="Enter amount"
//                 />
//                 <button
//                   className="mt-4 w-full bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-semibold"
//                   onClick={handleSaveProgress}
//                 >
//                   Save Progress
//                 </button>
//                 {updateStatus && (
//                   <p className="text-xs text-gray-600 mt-2">{updateStatus}</p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Government Schemes
//           <div className="bg-white shadow-lg rounded-2xl p-6 border border-orange-100">
//             <h2 className="text-xl font-semibold mb-2 text-orange-700">
//               🏛️ Recommended Schemes
//             </h2>
//             <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//               <li>MUDRA Yojana - Micro business loan</li>
//               <li>PM Sukanya Samriddhi - For girl child</li>
//               <li>Stand-Up India - For women entrepreneurs</li>
//             </ul>
//             <button
//               className="mt-4 w-full bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-medium"
//               onClick={() => router.push("/schemes")}
//             >
//               View All Schemes
//             </button>
//           </div>

//           // {/* Chatbot Assistant */}
//           // <div className="bg-white shadow-lg rounded-2xl p-6 border border-pink-100">
//           //   <h2 className="text-xl font-semibold mb-2 text-pink-700">
//           //     💬 Chat with AI Assistant
//           //   </h2>
//           //   <p className="text-sm text-gray-600 mb-3">
//           //     Ask about savings, goals or suitable government schemes.
//           //   </p>
//           //   <button
//           //     className="w-full bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-medium"
//           //     onClick={() => router.push("/chat")}
//           //   >
//           //     Open Chatbot
//           //   </button>
//           // </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// Dashboard.jsx
// src/app/dashboard/page.js

//import { auth } from '../../lib/firebase';
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Doughnut, Line } from "react-chartjs-2";
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

// Register ChartJS modules
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

  const [user, setUser] = useState({
    name: "User",
    goalProgress: 0,
    goal_type: "",
    goal_amount: 0,
    predicted_saving: 0,
    saved_till_now: 0,
    totalMonths: null,
    weeklySavings: [],
  });

  const [uid, setUid] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Get UID from local storage
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (!storedUid) {
      router.push("/login");
    } else {
      setUid(storedUid);
    }
  }, []);

  // Fetch user data from backend
  useEffect(() => {
    if (!uid) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user-data/${uid}`);
        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUser();
  }, [uid]);

  // Compute estimated months left
  const computedMonthsLeft =
    user.predicted_saving > 0
      ? Math.ceil((user.goal_amount - user.saved_till_now) / user.predicted_saving)
      : null;

  // Handle progress update
  const handleSaveProgress = async () => {
    const amount = parseFloat(amountRef.current.value);
    if (!amount || amount <= 0) {
      setStatusMsg("❌ Please enter a valid amount");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/update-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: uid,
        amount,
      }),
    });

    const data = await res.json();
    if (data.status === "progress updated") {
      setStatusMsg("✅ Progress updated");
      amountRef.current.value = "";

      // Refresh user data after update
      const refreshed = await fetch(`http://127.0.0.1:5000/user-data/${uid}`);
      const freshData = await refreshed.json();
      setUser((prev) => ({
        ...prev,
        ...freshData,
      }));
    } else {
      setStatusMsg("❌ Error updating progress");
    }
  };

  // Donut data for goal progress
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

  // Half donut data for months left
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

  // Weekly savings trend data
  const weeklyTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Savings",
        data: user.weeklySavings ?? [0, 0, 0, 0],
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
    <div className="min-h-screen bg-[#fff8f2] p-4 text-[#4e342e]">
      <h1
        className="text-center text-5xl font-extrabold mb-2"
        style={{ color: "#8B4513" }}
      >
        Welcome, {user.name || "User"}
      </h1>
      <p className="text-center text-sm mb-8 text-[#6b4c3b]">
        Here's your financial goal overview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-start">
        {/* Current Goal Card */}
        <div className="bg-[#fff0e0] rounded-2xl shadow-md p-6 flex flex-col items-center h-[520px] justify-between">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#8B4513] mb-2">🎯 Current Goal</h2>
            <p className="mb-2">To Save For {user.goal_type}</p>
            <div className="w-60 h-60">
              <Doughnut data={donutData} options={{ cutout: "70%" }} />
            </div>
            <div className="text-center mt-[-10px]">
              <p className="text-sm font-semibold text-[#8B4513]">
                {user.goalProgress}% Complete
              </p>
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

        {/* Monthly Progress Card */}
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

        {/* Weekly Saving Trend Card */}
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
