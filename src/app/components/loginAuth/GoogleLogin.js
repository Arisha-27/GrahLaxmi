//import { auth } from '../../../lib/firebase';
'use client';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../../lib/firebase';
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
    <div className="bg-[#fdf7ee] shadow-xl rounded-2xl px-8 py-6 text-center space-y-5">
  <h2 className="text-2xl font-bold text-[#d15b3b]">Begin your Financial Freedom With Us</h2>

  <p className="text-sm text-[#666]">
    Fast and secure sign-in to continue your journey with GrahLaxmi.
  </p>
<button
  onClick={login}
  disabled={loading}
  className={`w-full py-3 rounded-xl font-semibold transition duration-300
    ${loading
      ? 'bg-[#e8d1a0] text-[#666] cursor-not-allowed'
      : 'bg-gradient-to-r from-[#e28555] to-[#e9b149] hover:from-[#d97446] hover:to-[#dfa833] text-white shadow-md'
    }`}
>
  {loading ? "Signing in..." : "Login with Google"}
</button>


  <p className="text-xs text-[#999]">
    We never share your data without consent.
  </p>
</div>

  );
}