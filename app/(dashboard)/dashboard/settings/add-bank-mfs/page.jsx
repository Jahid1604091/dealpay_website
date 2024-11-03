"use client";

import {
  faLandmark,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DiffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Mfs from "../../components/bank-mfs/Mfs";
import Bank from "../../components/bank-mfs/Bank";
import Others from "../../components/bank-mfs/Others";
import Header from "../../components/Header";

export default function AddBankMfs() {
  const [paymentType, setPaymentType] = useState("mfs");

  const handlePaymentType = (type) => {
    setPaymentType(type);
  };

  return (
    <>
      <Header title={'Add Bank/Mfs'} />

      <main className="p-8 lg:p-16">
        <div className="flex justify-center items-center gap-12 lg:gap-16 mt-10 lg:mt-16 mb-10 lg:mb-20">
          {/* MFS Button */}
          <button
            type="button"
            onClick={() => handlePaymentType("mfs")}
            className={`transition-colors duration-300 ease-in-out border rounded-xl p-4 lg:p-6 border-primary ${
              paymentType == "mfs" && "bg-primary text-white"
            } w-[100px] lg:w-[120px] h-[100px] lg:h-[120px] text-xs lg:text-sm uppercase font-semibold flex flex-col justify-center items-center text-center`}
          >
            <FontAwesomeIcon icon={faMobile} className="text-3xl lg:text-4xl mb-2" />
            MFS
          </button>

          {/* Bank Button */}
          <button
            type="button"
            onClick={() => handlePaymentType("bank")}
            className={`transition-colors duration-300 ease-in-out border rounded-xl p-4 lg:p-6 border-primary ${
              paymentType == "bank" && "bg-primary text-white"
            } w-[100px] lg:w-[120px] h-[100px] lg:h-[120px] text-xs lg:text-sm uppercase font-semibold flex flex-col justify-center items-center text-center`}
          >
            <FontAwesomeIcon icon={faLandmark} className="text-3xl lg:text-4xl mb-2" />
            Bank
          </button>

          {/* Others Button */}
          <button
            type="button"
            onClick={() => handlePaymentType("others")}
            className={`transition-colors duration-300 ease-in-out border rounded-xl p-4 lg:p-6 border-primary ${
              paymentType == "others" && "bg-primary text-white"
            } w-[100px] lg:w-[120px] h-[100px] lg:h-[120px] text-xs lg:text-sm uppercase font-semibold flex flex-col justify-center items-center text-center`}
          >
            <DiffIcon size={28} className="mb-2" />
            Others
          </button>
        </div>

        {/* Payment Type Sections */}
        <div className="lg:w-[800px] mx-auto">
          {paymentType === "mfs" ? (
            <Mfs />
          ) : paymentType === "bank" ? (
            <Bank />
          ) : (
            <Others />
          )}
        </div>
      </main>
    </>
  );
}
