"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-[#203C5B] p-2 rounded-full"
        >
          <span
            style={{
              display: "block",
              width: "25px",
              height: "3px",
              backgroundColor: "white",
              margin: "4px 0",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              display: "block",
              width: "25px",
              height: "3px",
              backgroundColor: "white",
              margin: "4px 0",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              display: "block",
              width: "25px",
              height: "3px",
              backgroundColor: "white",
              margin: "4px 0",
              borderRadius: "2px",
            }}
          />
        </button>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-6 transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          onClick={() => {
            router.push("/dashboard");
            setIsOpen(false);
          }}
          className="cursor-pointer flex flex-col items-center mb-6"
        >
          <Image
            src={user?.photoURL || "/default-avatar.png"}
            alt="Profile"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h2 className="text-base font-medium mt-2 text-[#203C5B]">
            {user?.displayName || "User"}
          </h2>
          <p className="text-[#203C5B] text-xs">{user?.email || ""}</p>
        </div>

        <nav className="flex flex-col gap-4 text-[#203C5B] font-medium">
          <p
            onClick={() => {
              router.push("/dashboard");
              setIsOpen(false);
            }}
            className="cursor-pointer hover:underline"
          >
            Dashboard
          </p>
          <p
            onClick={() => {
              router.push("/govt-services");
              setIsOpen(false);
            }}
            className="cursor-pointer hover:underline"
          >
            Govt Services
          </p>
          <p
            onClick={() => {
              router.push("/chatbot");
              setIsOpen(false);
            }}
            className="cursor-pointer hover:underline"
          >
            Chatbot
          </p>
          <p
            onClick={() => {
              router.push("/faq");
              setIsOpen(false);
            }}
            className="cursor-pointer hover:underline"
          >
            FAQ
          </p>
          <p
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
            className="cursor-pointer text-red-500 hover:underline"
          >
            Logout
          </p>
        </nav>
      </div>
    </>
  );
}
