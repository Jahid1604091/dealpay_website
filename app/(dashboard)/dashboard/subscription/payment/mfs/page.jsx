"use client";

import {
  faArrowRight,
  faCoins,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  useGetAllAccountsQuery,
  useGetSingleSubscriptionsQuery,
} from "@/app/(root)/redux/slices/authApiSlice";
import { BASE_URL,DOMAIN_URL } from "@/app/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { setRenewSubscriptionInfo } from "@/app/(root)/redux/slices/authSlice";
import Header from "../../../components/Header";
import axios from "axios";

export default function MFS() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: accounts, isLoading, isError } = useGetAllAccountsQuery();
  const { loggedInUserInfo, renewSubscriptionInfo } = useSelector(
    (state) => state.auth
  );

  const [selectedMfs, setSelectedMfs] = useState(null);
  const [trxId, setTrxId] = useState("");
  const [bkashUrl, setBkashUrl] = useState("");
  const [sslUrl, setSslUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  useEffect(() => {
    if (accounts?.mfsAccounts && accounts.mfsAccounts.length > 0) {
      setSelectedMfs(accounts.mfsAccounts[0]);
    }
  }, [accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (trxId && selectedMfs) {
      dispatch(
        setRenewSubscriptionInfo({
          ...renewSubscriptionInfo,
          accountId: selectedMfs?._id,
          transactionId: trxId,
          isLive:false
        })
      );
      router.push("/dashboard/subscription");
    } else {
      toast.error("Please enter trx Id and select an MFS");
    }
  };

  const handlePaymentBkash = async () => {
    try {
      const { data } = await axios.post(
        BASE_URL + "/pay/bkash/subs/renew",
        {
          accountId: selectedMfs?._id,
          currencyId:renewSubscriptionInfo?.currentSubscription?.currencyId || loggedInUserInfo?.user?.currency,
          subscriptionId: renewSubscriptionInfo?.currentSubscription?._id,
          amount:renewSubscriptionInfo?.currentSubscription?.price,
          coupon: renewSubscriptionInfo?.coupon,
          reference: renewSubscriptionInfo?.reference,
          purpose: 'subscription_renewal',
          callbackUrl: DOMAIN_URL+'/dashboard/subscription',
        },
        {
          headers: {
            token: loggedInUserInfo?.access_token,
          },
        }
      );


      if (data.success) {
        setBkashUrl(data.bkashURL);
      } else {
        toast.error(data.msg || "Payment initiation failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.msg || error?.message || "An error occurred"
      );
    }
  };

  const handlePaymentSSL = async () => {
    try {
      const { data } = await axios.post(
        BASE_URL + "/pay/ssl/subs/renew",
        {
          accountId: selectedMfs?._id,
          currencyId:renewSubscriptionInfo?.currentSubscription?.currencyId || loggedInUserInfo?.user?.currency,
          subscriptionId: renewSubscriptionInfo?.currentSubscription?._id,
          amount:renewSubscriptionInfo?.currentSubscription?.price,
          coupon: renewSubscriptionInfo?.coupon,
          reference: renewSubscriptionInfo?.reference,
          purpose: 'subscription_renewal',
          callbackUrl: DOMAIN_URL+'/dashboard/subscription',
        },
        {
          headers: {
            token: loggedInUserInfo?.access_token,
          },
        }
      );

      if (data.success) {
        setSslUrl(data.url);
      } else {
        console.log(data);
        toast.error(data.msg || "Payment initiation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  useEffect(() => {
    if (bkashUrl) {
      window.location.href = bkashUrl;
      return;
    }
    if (sslUrl) {
      window.location.href = sslUrl;
      return;
    }
  }, [bkashUrl, sslUrl, router]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSslUrl("");
    setBkashUrl("");
    setModalUrl("");
  };
  return (
    <>
      <Header title={t('Make Payment')} />
      <section className="max-w-[480px] my-30 mx-auto px-16">
        <form onSubmit={handleSubmit}>
          <div className="border rounded-xl p-2 border-primary w-[80px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center mx-auto">
            <FontAwesomeIcon icon={faMobile} className="text-2xl" />
            MFS
          </div>

          <div className="flex items-center justify-center gap-16 my-20">
            {isLoading ? (
              <div className="my-6 px-4">Fetching MFS Accounts...</div>
            ) : accounts?.mfsAccounts?.length ? (
              accounts.mfsAccounts.map((acc, idx) => (
                <div
                  key={acc._id}
                  className={`cursor-pointer flex items-center justify-center${
                    selectedMfs === acc ? "opacity-100" : "opacity-15"
                  }`}
                  onClick={() => setSelectedMfs(acc)}
                >
                  <Image src={acc?.logo} height={68} width={68} alt={acc?.methode} />
                </div>
              ))
            ) : (
              <div className="my-6 px-4">No MFS accounts available.</div>
            )}
          </div>

          {accounts?.mfsAccounts?.length > 0 && selectedMfs?.live === false && (
            <>
              <div className="bg-[#DD2A5A] p-10 md:px-30 rounded-2xl">
                <ul>
                  <li className="text-white flex justify-between items-center my-6">
                    {t("Merchant Number")}:
                    <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                      {selectedMfs?.merchantNumber}
                    </span>
                  </li>
                  <li className="text-white flex justify-between items-center my-6">
                    {t("Business Name")}:
                    <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                      {selectedMfs?.businessName}
                    </span>
                  </li>
                  <li className="text-white flex justify-between items-center my-6">
                    {t("Total Amount")}:
                    <input
                      type="number"
                      disabled
                      value={renewSubscriptionInfo?.currentSubscription?.price}
                      className="text-center bg-white text-black rounded-full p-1 w-[160px]"
                    />
                  </li>
                  <li className="text-white flex flex-col justify-between items-center my-6">
                    {t("Transaction ID")}
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="md:px-30 text-center bg-white text-black rounded-full p-1"
                    />
                  </li>
                </ul>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-center justify-between mt-80">
                <SecondaryButton
                  text={t(`Can't submit`)}
                  button_text={t("Talk with team")}
                  link="/support"
                />
                <button type="submit" className="btn-primary">
                  <FontAwesomeIcon icon={faArrowRight} />
                  {t("Pay Now")}
                </button>
              </div>

              <IFrameModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                modalUrl={modalUrl}
              />
            </>
          )}
       <div className="flex flex-col justify-around items-center my-30">
            {selectedMfs?.live === true &&
              selectedMfs?.methode?.toLowerCase() == "bkash" && (
                <>
                  <div className="flex flex-col gap-16">
                    <div className="bg-[#DD2A5A] p-10 md:px-30 rounded-2xl">
                      <ul>
                        <li className="text-white flex justify-between items-center my-6">
                          {t("Merchant Number")}:
                          <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                            {selectedMfs?.merchantNumber}
                          </span>
                        </li>
                        <li className="text-white flex justify-between items-center my-6">
                          {t("Business Name")}:
                          <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                            {selectedMfs?.businessName}
                          </span>
                        </li>
                        <li className="text-white flex justify-between items-center my-6">
                          {t("Total Amount")}:
                          <input
                            type="number"
                            disabled
                            value={renewSubscriptionInfo?.amount}
                            className="text-center bg-white text-black rounded-full p-1 w-[160px]"
                          />
                        </li>
                        <li className="text-white flex flex-col justify-between items-center my-6">
                          {t("Transaction ID")}
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            className="md:px-30 text-center bg-white text-black rounded-full p-1"
                          />
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-4 justify-between items-center">
                      <p className="border-b-2 border-slate-300 w-[100px]">
                        BKash Live
                      </p>
                      <button
                        onClick={handlePaymentBkash}
                        className="bg-[#DD2A5A] rounded-full px-16 text-white py-2 flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faCoins} size={18} /> Start
                      </button>
                    </div>

                  </div>

                  <div className="flex flex-col md:flex-row gap-10 items-center justify-between mt-80">
                    <SecondaryButton
                      text={t(`Can't submit`)}
                      button_text={t("Talk with team")}
                      link="/support"
                    />
                    <button type="submit" className="btn-primary">
                      <FontAwesomeIcon icon={faArrowRight} />
                      {t("Pay Now")}
                    </button>
                  </div>
                </>
              )}
            {selectedMfs?.live === true &&
              selectedMfs?.methode?.toLowerCase() == "ssl" && (
                <button
                  onClick={handlePaymentSSL}
                  className="bg-[url('https://i.ibb.co/nRLTmmZ/sss.png')] hover:scale-105 active:scale-90 duration-300 bg-no-repeat bg-center bg-contain w-full h-[34px] border-blue-600 border rounded-full"
                ></button>
              )}
          </div>
        </form>
      </section>
    </>
  );
}

const IFrameModal = ({ isOpen, onClose, modalUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Live Payment</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <iframe
            src={modalUrl}
            title="bKash Payment"
            className="w-full h-96"
          ></iframe>
        </div>
      </div>
    </div>
  );
};