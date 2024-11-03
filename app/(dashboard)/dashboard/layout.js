"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import Sidebar from "./components/Sidebar";
import Hamburger from "./components/Hamburger";

export default function DashboardLayout({ children }) {
  const [isSidebarSmall, setIsSidebarSmall] = useState(false);
  const { loggedInUserInfo } = useSelector(state => state.auth);
  const router = useRouter();
  const handleButtonClick = () => {
    setIsSidebarSmall(!isSidebarSmall);
  };

  const handleSidebarCollapse = () => {
    setIsSidebarSmall(false);
  };

  useEffect(() => {
    if (!loggedInUserInfo?.access_token) {
      router.push('/auth/login')
    }
  }, [loggedInUserInfo])

  return (
    <>
      <Sidebar isSidebarSmall={isSidebarSmall} setIsSidebarSmall={setIsSidebarSmall} handleButtonClick={handleButtonClick} handleSidebarCollapse={handleSidebarCollapse} />
      <main className={`main-content md:ml-270  flex-1 min-h-screen transition-all duration-500 ease-in-out relative ${isSidebarSmall ? 'main-content_large' : ''}`}>
        <Hamburger handleButtonClick={handleButtonClick} />
        {children}
      </main>
    </>
  );
}
