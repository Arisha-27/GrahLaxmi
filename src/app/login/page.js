'use client';
import GoogleLogin from '../components/loginAuth/GoogleLogin'; // ✅ adjust if needed

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-[#FFF5F5]">
      <GoogleLogin />
    </div>
  );
}
