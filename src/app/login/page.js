//import { auth } from "../../lib/firebase";

'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import GoogleLogin from "../components/loginAuth/GoogleLogin";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/login");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">

  {/* ✅ Background Image */}
  <div className="absolute inset-0 -z-10">
    <Image
      src="/women.png"
      alt="Empowered Indian Woman"
      fill
      className="object-cover opacity-60 brightness-125 blur-xs"
      quality={80}
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10" />
  </div>
       
      {/* ✅ Foreground Content with custom theme */}
<div className="space-y-6 max-w-lg w-full">
  <div className="bg-[#fdf7ee] rounded-3xl shadow-2xl p-8 text-center">
    <h1 className="text-4xl font-extrabold text-[#203C5B] mb-2">Welcome to Grah Laxmi</h1>
    <p className="text-[#666] text-sm mb-6">
      Empowering women with financial freedom and smart tools.
    </p>

    {!loading && !user && (
      <GoogleLogin 
        buttonClassName="px-4 py-2 bg-[#e28555] text-white font-semibold rounded hover:bg-[#d97446] transition" 
      />
    )}
  </div>

  {!loading && user && (
    <div className="bg-[#fdf7ee] rounded-2xl shadow-md p-4 text-center">
      <p className="mb-2 text-sm text-[#666]">
        Hello, {user.displayName || user.email || user.phoneNumber}
      </p>
      <button
        onClick={logout}
        className="px-4 py-2 bg-[#e28555] text-white rounded hover:bg-[#d97446] transition"
      >
        Logout
      </button>
    </div>
  )}
</div>

     
    </main>
  );
}