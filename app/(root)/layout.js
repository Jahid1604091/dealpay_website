'use client'

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function RootLayout({ children }) {
  const { loggedInUserInfo } = useSelector(state => state.auth);
  const router = useRouter();

  // useEffect(() => {
  //   if (!loggedInUserInfo?.access_token) {
  //     router.push('/')
  //   }
  //   else{
  //     router.push('/dashboard')

  //   }
  // }, [loggedInUserInfo])
  return (
    <>
      {children}
    </>
  );
}
