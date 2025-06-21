'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import GoogleLogin from "@/app/components/Login/Auth/GoogleLogin";
import { useRouter } from "next/navigation";

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-amber-100 px-4 py-8">
      <div className="space-y-6 max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-4xl font-extrabold text-rose-600 mb-2">Welcome to Grah Laxmi</h1>
          <p className="text-gray-600 text-sm mb-6">
            Empowering women with financial freedom and smart tools.
          </p>

          {!loading && !user && <GoogleLogin />}
        </div>

        {!loading && user && (
          <div className="bg-white rounded-2xl shadow-md p-4 text-center">
            <p className="mb-2 text-sm text-gray-600">
              Hello, {user.displayName || user.email || user.phoneNumber}
            </p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
