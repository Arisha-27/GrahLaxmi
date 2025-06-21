'use client';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useState } from "react";

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Welcome ${user.displayName}`);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl px-8 py-6 text-center space-y-5">
      <h2 className="text-2xl font-bold text-rose-700">Sign in with Google</h2>
      <p className="text-sm text-gray-500">
        Fast and secure sign-in to continue your journey with GrahLaxmi.
      </p>

      <button
        onClick={login}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition duration-300 
          ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg'}`}
      >
        {loading ? "Signing in..." : "Login with Google"}
      </button>

      <p className="text-xs text-gray-400">
        We never share your data without consent.
      </p>
    </div>
  );
}
