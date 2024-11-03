"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyGetTransactionAmountQuery } from "@/app/(root)/redux/slices/transactionApiSlice";
import { useSelector } from "react-redux";
import Loader from "../Loader";

const TapToView = ({ type }) => {
  const { t } = useTranslation();
  const [showAmount, setShowAmount] = useState(false);
  const [amount, setAmount] = useState(0);
  const [triggerGetTransactionAmount, { isLoading }] =
    useLazyGetTransactionAmountQuery();
  const { loggedInUserInfo } = useSelector((state) => state.auth);

  const handleClick = async (type) => {
    setShowAmount(true); // Start showing the loader or amount fetching state
    try {
      const res = await triggerGetTransactionAmount({
        token: loggedInUserInfo?.access_token,
        type,
      }).unwrap();

      if (res.success) {
        setAmount(res.amount);
        setShowAmount(true); // Show the amount
        setTimeout(() => {
          setShowAmount(false); // Hide the amount after 2 seconds
        }, 2000);
      } else {
        setShowAmount(false); // Reset the state if fetching fails
      }
    } catch (error) {
      console.error("Error fetching amount:", error);
      setShowAmount(false);
    }
  };

  return (
    <button
      onClick={() => handleClick(type)}
      className="p-4 flex flex-col items-center justify-center gap-2 rounded-3xl shadow-lg border-0 h-[120px] w-[150px]"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!showAmount ? (
            <Image
              src="/icons/tk.svg"
              width={50}
              height={50}
              alt="Taka"
              className="w-full h-auto max-w-[50px] md:max-w-[50px] p-2"
            />
          ) : (
            <p
              className={`font-bold p-6 overflow-hidden whitespace-nowrap text-ellipsis max-w-full ${
                amount.length > 10 ? "text-base" : "text-2xl"
              }`}
            >
              ৳ {amount}
            </p>
          )}
          <p className="capitalize text-xl font-semibold p-6">
            {!showAmount && t("Tap to View")}
          </p>
        </>
      )}
    </button>
  );
};

export default TapToView;
