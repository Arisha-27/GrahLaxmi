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
      setUser(usr); // ✅ Local state for this component

      if (usr) {
        console.log("✅ Firebase User:", usr);

        // ✅ Store in global localStorage-based userStore
        setUserInfo({
          uid: usr.uid,
          email: usr.email,
          displayName: usr.displayName || "",
          photoURL: usr.photoURL || "",
        });

        router.push("/dashboard");
      } else {
        // ✅ Clear user info on logout or unauthenticated
        setUserInfo({
          uid: "",
          email: "",
          displayName: "",
          photoURL: "",
        });
      }
    });

    return () => unsubscribe();
  }, [setUser, router]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);

    // ✅ Clear global info safely
    setUserInfo({
      uid: "",
      email: "",
      displayName: "",
      photoURL: "",
    });

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
