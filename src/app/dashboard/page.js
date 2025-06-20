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


"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const amountRef = useRef();
  const [updateStatus, setUpdateStatus] = useState("");
  const [user, setUser] = useState({
    name: "Aiman",
    goalProgress: 0,
    goal_type: "",
    goal_amount: 0,
    predicted_saving: 0,
    saved_till_now: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/user-data/aiman123");
        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          goalProgress: data.goalProgress,
          goal_type: data.goal_type,
          goal_amount: data.goal_amount,
          predicted_saving: data.predicted_saving,
          saved_till_now: data.saved_till_now,
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  const handleSaveProgress = async () => {
    const amount = parseFloat(amountRef.current.value);
    if (!amount || amount <= 0) {
      setUpdateStatus("❌ Please enter a valid amount");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/update-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "aiman123",
        amount: amount,
      }),
    });

    const data = await res.json();
    if (data.status === "progress updated") {
      setUpdateStatus("✅ Progress updated");
      amountRef.current.value = "";
      const refreshed = await fetch("http://127.0.0.1:5000/user-data/aiman123");
      const freshData = await refreshed.json();
      setUser((prev) => ({
        ...prev,
        goalProgress: freshData.goalProgress,
        saved_till_now: freshData.saved_till_now,
      }));
    } else {
      setUpdateStatus("❌ Error updating progress");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d8b4fe] via-[#c084fc] to-[#a855f7] text-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-blue-800">
          Welcome, {user.name}!
        </h1>

        <div className="flex flex-col gap-8">
          {/* Goal Tracker */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">
              🎯 Your Current Goal
            </h2>

            {user.goal_amount === 0 ? (
              <p className="text-sm text-gray-500">No goal set yet.</p>
            ) : (
              <>
                <p className="text-md font-medium text-gray-700 capitalize">
                  {user.goal_type}
                </p>
                <div className="w-full bg-blue-100 rounded-full h-3 my-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${user.goalProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {user.goalProgress}% completed
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Saved ₹{user.saved_till_now} of ₹{user.goal_amount}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  📌 Recommended Monthly Saving: ₹{user.predicted_saving}
                </p>
              </>
            )}

            <button
              className="mt-4 w-full bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-semibold"
              onClick={() => router.push("/savings")}
            >
              + Set / Manage Goals
            </button>

            {/* Update saved amount section */}
            <div className="mt-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Add to Saved Amount
              </label>
              <input
                type="number"
                ref={amountRef}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter amount"
              />
              <button
                className="mt-4 w-full bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-semibold"
                onClick={handleSaveProgress}
              >
                Save Progress
              </button>
              {updateStatus && (
                <p className="text-xs text-gray-600 mt-2">{updateStatus}</p>
              )}
            </div>
          </div>

          {/* Government Schemes */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-orange-100">
            <h2 className="text-xl font-semibold mb-2 text-orange-700">
              🏛️ Recommended Schemes
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>MUDRA Yojana - Micro business loan</li>
              <li>PM Sukanya Samriddhi - For girl child</li>
              <li>Stand-Up India - For women entrepreneurs</li>
            </ul>
            <button
              className="mt-4 w-full  bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-medium"
              onClick={() => router.push("/schemes")}
            >
              View All Schemes
            </button>
          </div>

          {/* Chatbot Assistant */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-pink-100">
            <h2 className="text-xl font-semibold mb-2 text-pink-700">
              💬 Chat with AI Assistant
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Ask about savings, goals or suitable government schemes.
            </p>
            <button
              className="w-full bg-[#d38265] hover:bg-[#a0705e] text-white py-2 rounded-xl font-medium"
              onClick={() => router.push("/chat")}
            >
              Open Chatbot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
