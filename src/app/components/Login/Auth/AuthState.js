'use client';

import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from 'next/navigation';
import { setUserInfo } from "@/app/lib/userStore"; // ✅ Import

export default function AuthState({ user, setUser }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr); // ✅ Set local user
      if (usr) {
        console.log("✅ Firebase User:", usr);
        setUserInfo({
          uid: usr.uid,
          email: usr.email,
          name: usr.displayName || "", // Optional
        }); // ✅ Set global user
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [setUser, router]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserInfo(null); // ✅ Reset global state
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4">
      <button
        onClick={logout}
        className="px-4 py-2 bg-[#e28555] text-white font-medium rounded hover:bg-[#d97446] transition"
      >
        Logout
      </button>
    </div>
  );
}
