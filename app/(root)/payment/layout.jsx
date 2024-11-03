"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../redux/slices/authSlice";

const Layout = ({ children }) => {
  const { step } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (step === 5) {
      dispatch(setStep(1));
      redirect("/auth/login");
    }
  }, [step]);
  return <>{children}</>;
};

export default Layout;
