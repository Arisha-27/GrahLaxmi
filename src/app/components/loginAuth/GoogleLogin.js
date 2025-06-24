// 
// components/GoogleLogin.js
// components/loginAuth/GoogleLogin.js
'use client';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function GoogleLogin() {
  const router = useRouter();

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save UID and name to localStorage
      localStorage.setItem('uid', user.uid);
      localStorage.setItem('name', user.displayName);

      // ✅ Save user to backend if not already saved
      await fetch('http://127.0.0.1:5000/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName,
        }),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl px-8 py-6 text-center shadow-lg w-[90%] max-w-md">
      <h2 className="text-2xl font-bold text-rose-700 mb-4">Sign in with Google</h2>
      <button
        onClick={login}
        className="w-full py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
      >
        Login with Google
      </button>
    </div>
  );
}
