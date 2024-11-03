"use client";

import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  useLoginMutation,
  useLoginWOOtpMutation,
  useVerifyLoginOtpMutation,
} from "../../redux/slices/authApiSlice";
import { useRouter } from "next/navigation";
import { setUserInfo, setVerifiedUserInfo } from "../../redux/slices/authSlice";
import { generateToken } from "@/app/utils/firebase";
import { isBangladeshiPhoneNumber } from "@/app/utils/helpers";

import Header from "../../components/Header";
import SecondaryButton from "../../components/SecondaryButton";
import OTPInput from "../../components/OTPInput";
import { Fingerprint } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loggedInUserInfo: userInfo, verifiedUserInfo } = useSelector(
    (state) => state.auth
  );
  const [login, { isLoading: sendingOtpLoading }] = useLoginMutation();
  const [verifyLoginOtp,{isLoading:verifyOtpLoading}] = useVerifyLoginOtpMutation();
  const [loginWOOtp, {isLoading:loginWoOtpLoading}] = useLoginWOOtpMutation();

  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  //email or no
  const [email, setEmail] = useState(userInfo?.email || "");
  const [isOtpSent, setIsOtpSent] = useState(false);

  //no need but should be there
  const [isVisbleCheck, setIsVisbleCheck] = useState(false);

  const [authStatus, setAuthStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOtpSent) {
      const token = await generateToken();
      try {
        if (otp.length === 6 && userInfo?.userId) {
          const res = await verifyLoginOtp({
            otp,
            userId: userInfo?.userId,
            fcmToken: token,
          }).unwrap();
          if (res.success) {
            toast.dismiss();
            toast.success(res.msg);
            dispatch(
              setUserInfo({
                ...userInfo,
                access_token: res.token,
                user: res.user,
              })
            );
            dispatch(setVerifiedUserInfo({ token: res.token, user: res.user }));
            router.push("/dashboard");
          } else {
            toast.dismiss();
            toast.error(res.msg || "Login Credentials Error");
          }
        } else {
          toast.dismiss();
          toast.error("Login Credentials Error");
        }
      } catch (error) {}
    } else if (verifiedUserInfo?.token) {
      try {
        let res;
        if (isBangladeshiPhoneNumber(email)) {
          res = await loginWOOtp({
            data: {
              pin,
            },
            token: verifiedUserInfo?.token,
          }).unwrap();
        } else {
          res = await loginWOOtp({
            data: {
              pin,
            },
            token: verifiedUserInfo?.token,
          }).unwrap();
        }

        if (res.success) {
          dispatch(
            setUserInfo({
              ...userInfo,
              access_token: res.token,
              user: res.user,
            })
          );

          router.push("/dashboard");
        } else {
          toast.dismiss();
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(`Error in login ${error}`);
      }
    } else {
      try {
        let res;
        if (isBangladeshiPhoneNumber(email)) {
          res = await login({ number: email, pin, isNumber: true }).unwrap();
        } else {
          res = await login({ email, pin, isNumber: false }).unwrap();
        }

        if (res.success) {
          dispatch(
            setUserInfo({
              ...userInfo,
              userId: res.userId,
              email,
            })
          );
          setIsOtpSent(true);
        } else {
          toast.dismiss();
          toast.error(res.msg);
        }
      } catch (error) {
        console.log(`Error in login ${error}`);
      }
    }
  };

  const handleFingerprintLogin = async () => {
    try {
      // Step 1: Get publicKey options from the server (the challenge and user ID should come from the server)
      const publicKeyOptions = {
        publicKey: {
          challenge: new Uint8Array([
            // This challenge should come from the server
            0x8c, 0xaf, 0xd4, 0x7c, 0xc8, 0xaa, 0x0a, 0xee,
          ]).buffer,
          allowCredentials: [
            {
              id: new Uint8Array(16), // Replace with user's registered credential ID
              type: "public-key",
            },
          ],
          timeout: 60000, // Optional timeout for authentication
        },
      };

      // Step 2: Trigger fingerprint login using WebAuthn
      const credential = await navigator.credentials.get(publicKeyOptions);

      if (credential) {
        // Step 3: Send the result to the server for verification
        console.log("Fingerprint login successful:", credential);
        setAuthStatus("Login successful!");
        dispatch(
          setUserInfo({
            ...userInfo,
            access_token: verifiedUserInfo?.user?.token,
            user: verifiedUserInfo?.user,
          })
        );
      }
    } catch (error) {
      console.error("Fingerprint login failed:", error);
      setAuthStatus("Fingerprint login failed. Please try again.");
    }
  };
  return (
    <>
      <Header title="Dealpay Asia" />
      <section className="flex flex-col justify-center items-center">
        <main className="md:w-[600px] flex justify-center flex-col min-h-[80vh]">
          <form onSubmit={handleSubmit}>
            {!verifiedUserInfo?.token ? (
              <div className="my-30">
                <label>
                  <p className="text-secoundary">
                    {/* Enter your mobile number/email */}
                    {t("Enter your mobile number")}
                  </p>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="py-1 px-16 border-2 border-primary_thin w-full rounded-2xl focus:outline-none "
                    type="text"
                    required
                  />
                </label>
              </div>
            ) : (
              <div className="my-30">
                <label>
                  <p className="text-secoundary">your mobile number/email</p>
                  <input
                    value={
                      verifiedUserInfo?.user.email ||
                      verifiedUserInfo?.user.number
                    }
                    className="py-1 px-16 border-2 border-primary_thin w-full rounded-2xl focus:outline-none "
                    type="text"
                    disabled
                  />
                </label>
              </div>
            )}

            {isOtpSent ? (
              <div>
                <p className="mb-2 text-secoundary">
                  Enter the code sent to number/email
                </p>
                <OTPInput
                  value={otp}
                  setValue={setOtp}
                  setIsVisbleCheck={setIsVisbleCheck}
                />
              </div>
            ) : (
              <>
                <div className="my-30">
                  <label>
                    <p className="text-secoundary">{t("Enter your pin")}</p>
                    <input
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 6) {
                          setPin(value);
                        }
                      }}
                      value={pin}
                      className="py-1 px-16 border-2 border-primary_thin w-full rounded-2xl mb-5 focus:outline-none"
                      type="password"
                      required
                      maxLength={6} // This won't technically restrict number input length, but keeps the logic consistent.
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 6))
                      }
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </label>
                </div>

               {/* {verifiedUserInfo?.token && <div className="flex flex-col items-center my-20">
                  <p>Or Use Quick Pass</p>
                
                  <Fingerprint
                    size={60}
                    onClick={handleFingerprintLogin}
                    className="cursor-pointer"
                  />

                  {authStatus && (
                    <p className="mt-4 text-green-600">{authStatus}</p>
                  )}
                </div>} */}
              </>
            )}
            <Link
              className="text-light-black-text border-b-[1px]  border-light-black-text"
              href={"/auth/forget-pin"}
            >
              {t("Forget your PIN number")}
            </Link>

            <div className="flex flex-col gap-10 md:flex-row items-center justify-between mt-80">
              <SecondaryButton
                text={t(`Don't have an account`)}
                button_text="Signup"
                link={"/auth/signup"}
              />
              <button disabled={sendingOtpLoading || loginWoOtpLoading || verifyOtpLoading} className="btn-primary">{`${
                sendingOtpLoading ? "Sending OTP..." : loginWoOtpLoading ? 'Logging in...' : verifyOtpLoading ? 'Verifying OTP...': "Login"
              }`}</button>
            </div>
          </form>
        </main>
      </section>
    </>
  );
}
