"use client";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Trophy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { setRenewSubscriptionInfo } from "@/app/(root)/redux/slices/authSlice";
import Header from "../../components/Header";


const Success = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { paymentInfo } = useSelector((state) => state.account);
  const { renewSubscriptionInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // setTimeout(() => {
  //   dispatch(setRenewSubscriptionInfo(null));
  // }, 3000);
  return (
    <>
      <Header title={t("Success")} />
      <section className="max-w-[480px] my-30 mx-auto px-16">
        <Trophy size={300} className="text-primary mx-auto" />
        <h4 className="text-center md:text-start">
          {t("Congratulations")}! <br /> Your renew subscription status is
          {/* <span className="font-bold">{paymentInfo?.accNumber}</span> <br />
          {t('Amount')} : <span className="font-bold">{paymentInfo?.amount}</span>{" "}
          <br />
          {paymentInfo?.paymentType === "mfs" && (
            <>
              {t('Transaction ID')} :{" "}
              <span className="font-bold">{paymentInfo?.trxId}</span>
            </>
          )}{" "}
          <br /> */}
          <span className="text-primary font-bold">
            {renewSubscriptionInfo?.isLive === false
              ? t("under review")
              : t("Approved")}
          </span>
        </h4>

        <div className="flex flex-col md:flex-row gap-10 items-center justify-between mt-80">
          <button
            onClick={() => router.push("/dashboard/subscription")}
            className="btn-primary"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
        </div>
      </section>
    </>
  );
};

export default Success;
