"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import OTPInput from "../../components/OTPInput";
import { isBangladeshiPhoneNumber, isEmail } from "@/app/utils/helpers";
import {
  useLazyResetPinQuery,
  useVerifyOtpAndResetMutation,
} from "../../redux/slices/authApiSlice";
import { toast } from "react-toastify";
import {
  setIsOTPSentToReset,
  setPassResetToken,
} from "../../redux/slices/authSlice";
import Header from "@/app/(dashboard)/dashboard/components/Header";

const EXPIRE_TIME = 5 * 60 * 1000; //5 min

const ForgotPin = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const timeoutRef = useRef(null);
  const { isOTPSentToReset, passResetToken } = useSelector(
    (state) => state.auth
  );
  const [triggerResetPin, { data, isLoading }] = useLazyResetPinQuery();
  const [verifyOtpAndReset] = useVerifyOtpAndResetMutation();
  //email or no
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  //need as default
  const [isVisbleCheck, setIsVisbleCheck] = useState(false);

  const handleOtpSent = async (e) => {
    e.preventDefault();
    try {
      if (isBangladeshiPhoneNumber(email) || isEmail(email)) {
        const res = await triggerResetPin(email).unwrap();
        if (res.success) {
          dispatch(setIsOTPSentToReset(true));
          dispatch(setPassResetToken(res.passwordResetToken));
          toast.dismiss();
          toast.success(res.msg);

          // Save the current time to local storage
          typeof localStorage !== "undefined" &&
            localStorage.setItem("otpSentTime", Date.now());

          // Set a timeout to dispatch setIsOTPSentToReset(false) after 5 minutes
          timeoutRef.current = setTimeout(() => {
            dispatch(setIsOTPSentToReset(false));
            toast.error("OTP has expired. Please request a new one.");
            typeof localStorage !== "undefined" &&
              localStorage.removeItem("otpSentTime");
          }, EXPIRE_TIME); // 5 minutes
        } else {
          toast.dismiss();
          toast.error(res.msg);
        }
      } else {
        toast.dismiss();
        toast.error("Please insert a valid number or email");
      }
    } catch (error) {
      console.log(`Error in otp reset ${error}`);
    }
  };

  // Effect to check if OTP has already expired based on stored time
  useEffect(() => {
    const otpSentTime =
      typeof localStorage !== "undefined" &&
      localStorage.getItem("otpSentTime");
    if (otpSentTime) {
      const elapsed = Date.now() - otpSentTime;
      if (elapsed >= EXPIRE_TIME) {
        // OTP expired
        dispatch(setIsOTPSentToReset(false));
        toast.error("OTP has expired. Please request a new one.");
        typeof localStorage !== "undefined" &&
          localStorage.removeItem("otpSentTime");
      } else {
        // Still within valid time
        dispatch(setIsOTPSentToReset(true));
        timeoutRef.current = setTimeout(() => {
          dispatch(setIsOTPSentToReset(false));
          toast.error("OTP has expired. Please request a new one.");
          typeof localStorage !== "undefined" &&
            localStorage.removeItem("otpSentTime");
        }, EXPIRE_TIME - elapsed); // Set the remaining time
      }
    }

    // Cleanup the timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtpAndReset({
        data: { newPin: pin },
        otp,
        passResetToken,
      }).unwrap();
      if (res.success) {
        dispatch(setIsOTPSentToReset(false));
        dispatch(setPassResetToken(null));
        toast.dismiss();
        toast.success(res.msg);
        router.push("/auth/login");
      } else {
        toast.dismiss();
        toast.error(res.msg || "Smoething Wrong! try again");
      }
    } catch (error) {
      console.log(`Error  reset ${error}`);
    }
  };
  return (
    <>
      <Header title="Reset PIN" />
      <section className="flex flex-col justify-center items-center min-h-[80vh]  p-16">
        <main className="md:w-[500px] w-full ">
          {isOTPSentToReset ? (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <p className="mb-4 text-gray-700">
                  Enter the code sent to number/email
                </p>
                <OTPInput
                  value={otp}
                  setValue={setOtp}
                  setIsVisbleCheck={setIsVisbleCheck}
                />
              </div>

              <div className="my-16">
                <label>
                  <p className="text-gray-700 mb-2">{t("Enter your pin")}</p>
                  <input
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 6) {
                        setPin(value);
                      }
                    }}
                    value={pin}
                    className="py-2 px-4 border-2 border-gray-300 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
                    type="number"
                    required
                    maxLength={6}
                    onInput={(e) =>
                      (e.target.value = e.target.value.slice(0, 6))
                    }
                  />
                </label>
              </div>

              <button className="btn-primary">Submit</button>
            </form>
          ) : (
            <form onSubmit={handleOtpSent} className="w-full">
              <div className="my-16">
                <label>
                  <p className="text-gray-700 mb-4">
                    Enter your mobile number/email
                  </p>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="py-2 px-4 border-2 border-gray-300 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
                    type="text"
                    required
                  />
                </label>
              </div>

              <button disabled={isLoading} className="btn-primary mx-auto">
                {isLoading ? "Sending OTP..." : "Send"}
              </button>
            </form>
          )}
        </main>
      </section>
    </>
  );
};

export default ForgotPin;
