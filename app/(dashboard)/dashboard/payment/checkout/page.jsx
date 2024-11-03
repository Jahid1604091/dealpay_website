"use client";

import React from "react";
import { faArrowRight, faMobile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Coins } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";


import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import Header from "../../components/Header";

export default function PaymentStep1() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col justify-center items-center">
      <Header />

      <main className="md:w-[500px] flex flex-col items-center mt-20">
        <button className="border rounded-xl p-2 border-primary w-[80px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start">
          <FontAwesomeIcon icon={faMobile} className="text-2xl" />
          MFS
        </button>

        <div className="flex items-center justify-center gap-16 my-20">
          <Image
            src="/images/bkash.png"
            width={68}
            height={68}
            priority
            alt="bkash"
          />
          <Image
            src="/images/bkash.png"
            width={68}
            height={68}
            priority
            alt="bkash"
          />
          <Image
            src="/images/bkash.png"
            width={68}
            height={68}
            priority
            alt="bkash"
          />
        </div>

        <div className="bg-[#DD2A5A] p-10 md:px-30 rounded-2xl">
          <ul className="">
            <li className="text-white  flex justify-between items-center my-6">
             {t('Merchant Number')} :{" "}
              <span className="text-end bg-white text-black rounded-full p-1">
                +8801735791592
              </span>
            </li>
            <li className="text-white flex justify-between items-center my-6">
              {t('Business Name')} :{" "}
              <span className="text-end bg-white text-black rounded-full p-1">
                +8801735791592
              </span>
            </li>
            <li className="text-white flex justify-between items-center my-6">
              {t('Total Amount')} :{" "}
              <span className="text-end bg-white text-black rounded-full p-1">
                +8801735791592
              </span>
            </li>
            <li className="text-white flex flex-col justify-between items-center my-6">
              {t('Transaction ID')}
              <span className="md:px-30 text-end bg-white text-black rounded-full p-1">
                +8801735791592
              </span>
            </li>
          </ul>
        </div>

        <div className="flex justify-between items-center my-30">
          <p className="border-b-2 border-slate-300 w-[100px]">BKash Live</p>
          <button className="bg-[#DD2A5A] rounded-full px-16 text-white py-2 flex items-center gap-1">
            <Coins size={18} /> Start
          </button>
        </div>
      </main>

      <div className="md:w-[700px] mx-auto mt-20">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          <SecondaryButton
            text={t(`Can't submit`)}
            button_text={t('Talk with team')}
            link="/support"
          />
          <button className="btn-primary">
            <FontAwesomeIcon icon={faArrowRight} />
            <p>{t('Pay Now')}</p>
          </button>
        </div>
      </div>
    </section>
  );
}
