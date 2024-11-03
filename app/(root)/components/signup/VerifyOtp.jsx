"use client";

import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import OTPInput from "@/app/(root)/components/OTPInput";
import Icon from "@/app/(root)/components/Icon";
import Header from "@/app/(root)/components/Header";
import {
  useGetAllCurrenciesQuery,
  usePreRegEmailMutation,
  useVerifyOtpMutation,
} from "@/app/(root)/redux/slices/authApiSlice";
import {
  setInfo,
  setIsOTPSent,
  setIsOTPVerified,
  setPreRegID,
  setStep,
} from "@/app/(root)/redux/slices/authSlice";
import { isEmail } from "@/app/utils/helpers";
import { useTranslation } from "react-i18next";

export default function VerifyOTP() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [preRegEmail] = usePreRegEmailMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const { data } = useGetAllCurrenciesQuery();
  const { preRegID, isOTPVerified, info, email, countryId, step, isOTPSent } =
    useSelector((state) => state.auth);
  const professions = [
    {
      id: 1,
      name: "Investor",
    },
    {
      id: 2,
      name: "Enterprenuer",
    },
    {
      id: 3,
      name: "Doctor",
    },
  ];
  const legaltypes = [
    {
      id: 1,
      name: "Private Ltd",
    },
    {
      id: 2,
      name: "Public Ltd",
    },
  ];

  const [otp, setOtp] = useState("");
  const [isVisibleCheck, setIsVisbleCheck] = useState(false);
  const [pin, setPin] = useState(null);
  const [accountType, setAccountType] = useState(
    info?.accountType || "personal"
  );
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState(professions[0]?.name || "");
  const [legalType, setLegalType] = useState(legaltypes[0]?.name || "");
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  //for business
  const [category, setCategory] = useState(
    professions[0]?.name || info?.profession
  );
  const [representativeName, setRepresentativeName] = useState("");
  const [designation, setDesignation] = useState("");

  const [otpChecking, setOTPChecking] = useState(false);
  const [otpVerfied, setOTPVerified] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const handleCurrencyChange = (e) => {
    const currencyId = e.target.value;
    // Check if the currency is already selected or if more than two are selected
    if (
      !selectedCurrencies.some((currency) => currency._id === currencyId) &&
      selectedCurrencies.length < 2
    ) {
      const selectedCurrency = data?.currencies.find(
        (currency) => currency._id === currencyId
      );
      setSelectedCurrencies((prev) => [...prev, selectedCurrency]);
    } else if (selectedCurrencies.length >= 2) {
      toast.warn("You can only select up to 2 currencies.");
    }
  };

  const removeCurrency = (currencyId) => {
    setSelectedCurrencies((prev) =>
      prev.filter((currency) => currency._id !== currencyId)
    );
  };

  //otp verification
  async function VerifyOTP() {
    try {
      const res = await verifyOtp({ otp, preRegId: preRegID }).unwrap();
      if (res.success) {
        dispatch(setIsOTPVerified(true));
        dispatch(setIsOTPSent(false));
        toast.success(res?.data?.msg);
      } else {
        toast.error(res?.msg);
      }

      setIsVisbleCheck(false);
    } catch (error) {
      console.log(`Error in Verifying OTP ${error}`);
    }
  }
  useEffect(() => {
    if (otp.length == 6) {
      VerifyOTP();
    }
  }, [otp]);

  useEffect(() => {
    let timer;
    if (!isOTPVerified && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResendClick = async () => {
    if (canResend) {
      try {
        let res;
        if (isEmail(email)) {
          res = await preRegEmail({
            countryId,
            email,
            isNumber: false,
          }).unwrap();
        } else {
          res = await preRegEmail({
            countryId,
            number: email,
            isNumber: true,
          }).unwrap();
        }

        if (res.success) {
          dispatch(setPreRegID(res?.preRegId));
          toast.success(res.msg);
        } else {
          toast.error(res.msg);
        }
      } catch (error) {
        console.error("Error in preRegEmail Again:", error?.data?.msg);
        toast.error(error?.data?.msg);
      }

      setResendTimer(30);
      setCanResend(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      accountType == "personal" &&
      pin.length === 6 &&
      name &&
      address &&
      selectedCurrencies?.length === 2
    ) {
      dispatch(
        setInfo({
          ...info,
          pin,
          accountType,
          name,
          gender,
          profession,
          currencyId: selectedCurrencies[0]?._id,
          currencyId2: selectedCurrencies[1]?._id,
          address,
        })
      );
      // router.push("/auth/signup/e-kyc");
      dispatch(setStep(3));
    } else if (
      accountType == "business" &&
      pin.length === 6 &&
      name &&
      address &&
      representativeName &&
      designation &&
      selectedCurrencies?.length === 2
    ) {
      dispatch(
        setInfo({
          ...info,
          pin,
          accountType,
          name,
          gender,
          profession,
          currencyId: selectedCurrencies[0]?._id,
          currencyId2: selectedCurrencies[1]?._id,
          address,
          representativeName,
          designation,
          legalType,
          category,
        })
      );
      // router.push("/auth/signup/e-kyc");
      dispatch(setStep(3));
    } else {
      toast.warn("Please fill all the fields");
    }
  };

  return (
    <>
      <Header title={t("Verify OTP/More")} />
      <section className="flex flex-col justify-center items-center p-16">
        <main className="md:min-w-[600px] flex justify-center flex-col gap-6 min-h-[80vh]">
          <div className={isOTPSent ? "" : isOTPVerified && "hidden"}>
            <p className="mb-2 text-secoundary">
              {t("Enter the code sent to")} {email}
            </p>
            <OTPInput setValue={setOtp} setIsVisbleCheck={setIsVisbleCheck} />
          </div>

          <>
            <div
              className={`${
                !isOTPVerified ? "hidden" : isOTPSent && ""
              } my-10 relative`}
            >
              <p className="mb-2 text-secoundary">
                Enter your account password
              </p>
              <OTPInput
                setValue={setPin}
                otpValue={pin}
                setIsVisbleCheck={setIsVisbleCheck}
              />

              {isVisibleCheck && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="absolute bottom-4 left-290 text-3xl text-primary"
                />
              )}
            </div>

            <div>
              <p className="text-secondary border-b-[1px] border-primary text-xl my-10">
                {t("Select account type")}
              </p>
              <div className="flex gap-80 my-2">
                <div
                  className={`w-20 grid place-items-center cursor-pointer ${
                    accountType == "personal" ? "opacity-100" : "opacity-20"
                  }`}
                  onClick={() => setAccountType("personal")}
                >
                  <Icon
                    className="border-[1px] border-primary p-2 rounded-md"
                    path={"user"}
                    name={"user"}
                    height={60}
                    width={60}
                  />
                  <p className="font-semibold text-secondary">
                    {t("Personal")}
                  </p>
                </div>
                <div
                  className={`w-20 grid place-items-center cursor-pointer ${
                    accountType == "business" ? "opacity-100" : "opacity-20"
                  }`}
                  onClick={() => setAccountType("business")}
                >
                  <Icon
                    className="border-[1px] border-primary p-2 rounded-md"
                    path={"business"}
                    name={"user"}
                    height={60}
                    width={60}
                  />
                  <p className="font-semibold text-secoundary">
                    {t("Business")}
                  </p>
                </div>
              </div>
            </div>
            {accountType == "personal" ? (
              <>
                <div className="my-10">
                  <label>
                    <p className="border-b-[1px] text-xl text-secondary border-primary">
                      {t("Your name")}
                    </p>
                    <input
                      type="text"
                      className="mt-2 text-secoundary w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name..."
                    />
                  </label>
                </div>

                <div className="my-10">
                  <p className="text-xl text-secondary border-b-[1px] border-primary">
                    {t("Gender")}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <p
                      onClick={() => setGender("male")}
                      className={`text-secoundary cursor-pointer ${
                        gender == "male" ? "opacity-100" : "opacity-20"
                      }`}
                    >
                      Male
                    </p>
                    {"|"}
                    <p
                      className={`text-secoundary cursor-pointer ${
                        gender == "female" ? "opacity-100" : "opacity-20"
                      }`}
                      onClick={() => setGender("female")}
                    >
                      Female
                    </p>
                    {"|"}
                    <p
                      className={` text-secondary cursor-pointer ${
                        gender == "other" ? "opacity-100" : "opacity-20"
                      }`}
                      onClick={() => setGender("other")}
                    >
                      Other
                    </p>
                  </div>
                </div>

                <div className="my-10">
                  <label>
                    <p className="border-b-[1px] text-xl  text-secondary border-primary">
                      {t("Address")}
                    </p>
                    <input
                      type="text"
                      className="mt-2 text-secondary w-full"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address..."
                    />
                  </label>
                </div>

                <div className="flex justify-between items-center">
                  <div className="my-10 flex flex-col gap-6 w-1/3">
                    <label
                      htmlFor=""
                      className="text-secondary pb-2 border-b-[1px] border-primary"
                    >
                      {t("Profession")}
                    </label>
                    <select
                      className="cursor-pointer  text-gray-700 py-2 px-4 focus:outline-none focus:ring-0 focus:border-blue-500"
                      onChange={(e) => setProfession(e.target.value)}
                    >
                      {professions.map((profession) => (
                        <option
                          key={profession.id}
                          value={profession.name}
                          className="bg-gray-100 text-gray-700"
                        >
                          {profession.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="my-10 flex flex-col gap-6 w-1/3">
                    <label
                      htmlFor=""
                      className="text-secondary pb-2 border-b-[1px] border-primary"
                    >
                      {t("Currency")}
                    </label>
                    <div>
                      {/* Dropdown to select currency */}
                      <select
                        className="cursor-pointer text-gray-700 py-2 px-4 mb-4"
                        onChange={handleCurrencyChange}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a currency
                        </option>
                        {data?.currencies.map((currency) => (
                          <option key={currency._id} value={currency._id}>
                            {currency.name}
                          </option>
                        ))}
                      </select>

                      {/* Box displaying selected currencies */}
                      <div className="flex flex-wrap space-x-4 mt-4">
                        {selectedCurrencies.map((currency) => (
                          <div
                            key={currency._id}
                            className="flex items-center space-x-2 py-2 px-4 text-gray-700 bg-gray-200 rounded"
                          >
                            <span>{currency.name}</span>
                            <button
                              className="text-red-500"
                              onClick={() => removeCurrency(currency._id)}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="my-10">
                  <label>
                    <p className="border-b-[1px] text-xl text-secondary border-primary">
                      {t("Business name")}
                    </p>
                    <input
                      type="text"
                      className="mt-2 text-secoundary w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name..."
                    />
                  </label>
                </div>
                <div className="my-10 flex flex-col gap-6 w-1/3">
                  <label
                    htmlFor=""
                    className="text-secondary pb-2 border-b-[1px] border-primary"
                  >
                    {t("Legal type")}
                  </label>
                  <select
                    className="cursor-pointer  text-gray-700 py-2 px-4 focus:outline-none focus:ring-0 focus:border-blue-500"
                    onChange={(e) => setLegalType(e.target.value)}
                  >
                    {legaltypes.map((legal) => {
                      return (
                        <option key={legal.id} value={legal.name}>
                          {legal.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="my-10">
                  <label>
                    <p className="border-b-[1px] text-xl text-secondary border-primary">
                      {t("Registered Address")}
                    </p>
                    <input
                      type="text"
                      className="mt-2 text-secoundary w-full"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address..."
                    />
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <div className="my-10 flex flex-col gap-6 w-1/3">
                    <label
                      htmlFor=""
                      className="text-secondary pb-2 border-b-[1px] border-primary"
                    >
                      {t("Category")}
                    </label>
                    <select
                      className="cursor-pointer  text-gray-700 py-2 px-4 focus:outline-none focus:ring-0 focus:border-blue-500"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {professions.map((cat) => {
                        return (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="my-10 flex flex-col gap-6 w-1/3">
                    <label
                      htmlFor=""
                      className="text-secondary pb-2 border-b-[1px] border-primary"
                    >
                      {t("Select currency")}
                    </label>
                    <div>
                      {/* Dropdown to select currency */}
                      <select
                        className="cursor-pointer text-gray-700 py-2 px-4 mb-4"
                        onChange={handleCurrencyChange}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a currency
                        </option>
                        {data?.currencies.map((currency) => (
                          <option key={currency._id} value={currency._id}>
                            {currency.name}
                          </option>
                        ))}
                      </select>

                      {/* Box displaying selected currencies */}
                      <div className="flex flex-wrap space-x-4 mt-4">
                        {selectedCurrencies.map((currency) => (
                          <div
                            key={currency._id}
                            className="flex items-center space-x-2 py-2 px-4 text-gray-700 bg-gray-200 rounded"
                          >
                            <span>{currency.name}</span>
                            <button
                              className="text-red-500"
                              onClick={() => removeCurrency(currency._id)}
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-10">
                  <label>
                    <p className="border-b-[1px] text-xl text-secondary border-primary">
                      {t("Representative name")}
                    </p>
                    <input
                      type="text"
                      className="mt-2 text-secoundary w-full"
                      value={representativeName}
                      onChange={(e) => setRepresentativeName(e.target.value)}
                      placeholder="Enter your address..."
                    />
                  </label>
                </div>
                <div className="my-10">
                  <label>
                    <p className="border-b-[1px] text-xl text-secondary border-primary">
                      {t("Designation")}
                    </p>
                    <input
                      type="text"
                      className="mt-2 text-secondary w-full"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Enter your address..."
                    />
                  </label>
                </div>
              </>
            )}

            <div className="flex flex-col md:flex-row gap-16 md:gap-2 items-center justify-between mt-40">
              {!isOTPVerified && (
                <p className="flex justify-center items-center bg-light-black-bg rounded-3xl w-full py-10 text-center px-1 text-sm text-light-black-text">
                  Didn&apos;t receive code?{" "}
                  <button
                    className="font-semibold text-sm border-b-[2px] border-light-black-text"
                    onClick={handleResendClick}
                    disabled={!canResend}
                  >
                    {canResend ? "Resend code" : `Resend in ${resendTimer} sec`}
                  </button>
                </p>
              )}
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn-primary mx-auto"
              >
                {t("Continue")}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </>
        </main>
      </section>
    </>
  );
}
