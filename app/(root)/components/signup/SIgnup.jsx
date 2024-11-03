"use client";

import React, { useEffect, useRef, useState } from "react";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import {
  useGetAllCountriesQuery,
  usePreRegEmailMutation,
} from "../../redux/slices/authApiSlice";

import {
  setCountryId,
  setEmailState,
  setIsOTPSent,
  setIsOTPVerified,
  setPreRegID,
  setStep,
} from "../../redux/slices/authSlice";

import Header from "../../components/Header";
import SecondaryButton from "../../components/SecondaryButton";

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const {t} = useTranslation();

  const { step } = useSelector((state) => state.auth);
  const [preRegEmail, { isError, isSuccess, isLoading:preRegLoading }] = usePreRegEmailMutation();
  const { data, isLoading } = useGetAllCountriesQuery();

  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelected(data?.countries[0]);
  }, [data]);

  const handleSelect = (country) => {
    setSelected(country);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (selected?.name === "Bangladesh") {
        res = await preRegEmail({
          countryId: selected._id,
          number: email,
          isNumber: true,
        }).unwrap();
      } else {
        res = await preRegEmail({
          countryId: selected._id,
          email,
          isNumber: false,
        }).unwrap();
      }

      if (res.success) {
        dispatch(setEmailState(email));
        dispatch(setPreRegID(res?.preRegId));
        dispatch(setCountryId(selected._id));
        dispatch(setIsOTPSent(true));
        dispatch(setIsOTPVerified(false));
        // router.push("/auth/signup/verify-otp");
        dispatch(setStep(2));
        toast.success(res.msg);
      } else {
        toast.error(res.msg);
      }
    } catch (error) {
      console.error("Error in preRegEmail:", error?.data?.msg);
      toast.error(error?.data?.msg);
    }
  };

  return (
    <>
      <Header title="Sign up with DEALPAY ASIA" />
      <section className="flex flex-col justify-center items-center p-16">
        <main className="md:w-[600px] flex justify-center flex-col  min-h-[80vh]">
          <form onSubmit={handleSubmit}>
            <div className="my-30">
              <p>Select Country</p>
              <div className="relative" ref={dropdownRef}>
                <div
                  className="p-2 cursor-pointer flex justify-between items-center py-1 px-16 border-2 border-primary_thin w-full rounded-2xl mb-5 focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isLoading
                    ? "Fetching Countries..."
                    : selected
                    ? selected.name
                    : t('Select country')}
                  {/* <span>{isOpen ? "▲" : "▼"}</span> */}
                  {selected && (
                    <Image
                      src={`https://flagsapi.com/${selected?.countryCode}/flat/64.png`}
                      alt={selected?.name}
                      height={20}
                      width={20}
                    />
                  )}
                </div>
                {isOpen && (
                  <div className="absolute z-10 -mt-10 border border-gray-300 bg-white w-full ">
                    {data?.countries?.map((country) => (
                      <div
                        key={country._id}
                        className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-200 "
                        onClick={() => handleSelect(country)}
                      >
                        {country.name}
                        <Image
                          src={`https://flagsapi.com/${country?.countryCode}/flat/64.png`}
                          alt={country.name}
                          height={20}
                          width={20}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="my-30">
              <label>
                <p className="text-secondary">
                  Enter your{" "}
                  {selected?.name === "Bangladesh" ? "phone" : "email address"}
                </p>
                <input
                  className="py-1 px-16 border-2 border-primary_thin w-full rounded-2xl mb-5 focus:outline-none"
                  type={selected?.name === "Bangladesh" ? "number" : "email"}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-16 md:gap-10 items-center justify-between mt-80">
              <SecondaryButton
                text={t('Already have an account')}
                button_text="Login"
                link={"/auth/login"}
              />
              <button type="submit" disabled={preRegLoading} className="btn-primary">
              {preRegLoading ? 'Registering...':  t('Continue')} <MoveRight />
              </button>
            </div>
          </form>
        </main>
      </section>
    </>
  );
}
