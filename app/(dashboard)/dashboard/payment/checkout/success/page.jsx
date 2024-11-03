"use client";

import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trophy } from "lucide-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import Header from "../../../components/Header";


const Success = () => {
  const router = useRouter();
  const {t} = useTranslation();
  const { paymentInfo } = useSelector((state) => state.account);

  return (
    <>
      <Header title={t('Success')} />
      <section className="max-w-[480px] my-30 mx-auto px-16">
        <Trophy size={300} className="text-primary mx-auto" />
        <h4 className="text-center md:text-start">
          {t('Congratulations')}! <br />{t('Your Payment to')}{" "}
          <span className="font-bold">{paymentInfo?.accNumber}</span> <br />
          {t('Amount')} : <span className="font-bold">{paymentInfo?.amount}</span>{" "}
          <br />
          {paymentInfo?.paymentType === "mfs" && (
            <>
               {t('Transaction ID')} :{" "}
              <span className="font-bold">{paymentInfo?.trxId}</span>
            </>
          )}{" "}
          <br />
          {t('is status')} <span className="text-primary font-bold">{paymentInfo?.isLive === false ?  t('under review') : paymentInfo?.paymentType =='others' ? t('Approved') : t('Approved')}</span>
        </h4>

        <div className="flex flex-col md:flex-row gap-10 items-center justify-between mt-80">
          <button>{t('Track Now')}</button>
          <button onClick={()=>router.push('/dashboard/payment')} className="btn-primary">
            <FontAwesomeIcon icon={faArrowLeft} />
            {t('Send Another')}
          </button>
        </div>
      </section>
    </>
  );
};

export default Success;
