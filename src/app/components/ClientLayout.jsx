"use client";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}
      <main className={showSidebar && isSidebarOpen ? "ml-64" : ""}>
        {children}
      </main>
    </>
  );
}
