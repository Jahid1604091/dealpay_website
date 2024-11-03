"use client";
import React, { useEffect } from "react";

import { MoveLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../redux/slices/authSlice";

const Header = ({ title }) => {

  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.auth);

  useEffect(() => {
    if (step < 1) {
      dispatch(setStep(1));
    }
  }, [step]);
  return (
    <div className="flex gap-1 bg-primary border text-white items-center justify-center capitalize py-3 auth-top">
      {step !== 5 && (
        <button onClick={() => dispatch(setStep(step - 1))}>
          <MoveLeft size={45} />
        </button>
      )}
      <h2 className="text-xl md:text-4xl">{title}</h2>
    </div>
  );
};

export default Header;
