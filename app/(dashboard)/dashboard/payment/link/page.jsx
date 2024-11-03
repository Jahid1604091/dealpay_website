"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const PaymentLink = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { loggedInUserInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if the user is not logged in
    if (!loggedInUserInfo) {
      // Redirect to login page and pass the current URL for redirection after login
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      // If the user is logged in, redirect to the payment receiver page
      const receiverId = searchParams.get("id");
      if (receiverId) {
        router.push(`/dashboard/payment/receiver?receiver=${receiverId}`);
      }
    }
  }, [loggedInUserInfo, router, searchParams, pathname]);

  return null; // No need to render anything
};

export default PaymentLink;
