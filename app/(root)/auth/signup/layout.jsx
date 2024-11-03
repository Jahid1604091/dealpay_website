"use client";
import React from "react";
import { useSelector } from "react-redux";
import VerifyOTP from "../../components/signup/VerifyOtp";
import Signup from "../../components/signup/SIgnup";
import Ekyc from "../../components/signup/Ekyc";
import Subscription from "../../components/signup/Subscription";
import Success from "../../components/signup/Success";

export default function SignupLayout({ children }) {

  const { step } = useSelector((state) => state.auth);

  switch (step) {
    case 1:
      return <Signup />;
    case 2:
      return <VerifyOTP />;
    case 3:
      return <Ekyc />;
    case 4:
      return <Subscription />;
    case 5:
      return <Success />;

    default:
      return <Signup/>;
  }
  return <>{children}</>;
}
