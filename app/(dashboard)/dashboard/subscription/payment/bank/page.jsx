"use client";

import { faArrowRight, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  useGetAllAccountsQuery,
  useGetSingleSubscriptionsQuery,
} from "@/app/(root)/redux/slices/authApiSlice";
import { BASE_URL } from "@/app/utils/constants";
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { setRenewSubscriptionInfo } from "@/app/(root)/redux/slices/authSlice";
import Header from "../../../components/Header";

export default function Bank() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {t} = useTranslation();
  const { data: accounts, isLoading, isError } = useGetAllAccountsQuery();
  const { renewSubscriptionInfo, loggedInUserInfo } = useSelector(
    (state) => state.auth
  );

  const [selectedBank, setSelectedBank] = useState(null); // Initially null to handle the loading state
  const [bankSlip, setBankSlip] = useState("");
  const bankSlipRef = useRef(null);
  const { data: targetMfs } = useGetSingleSubscriptionsQuery(
    renewSubscriptionInfo?.currentSubscriptionId
  );
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (loggedInUserInfo?.user.country === "66b054740830d572d5589fdd") {
      setAmount(targetMfs?.subscription?.priceInBDT);
    } else {
      setAmount(targetMfs?.subscription?.priceInUSD);
    }
  }, [targetMfs]);
  // Effect to set the default selectedMfs when accounts are loaded
  useEffect(() => {
    if (accounts?.bankAccounts && accounts.bankAccounts.length > 0) {
      setSelectedBank(accounts.bankAccounts[0]);
    }
  }, [accounts]);

  const handleBankSlipChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setBankSlip({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bankSlip && selectedBank) {
      dispatch(
        setRenewSubscriptionInfo({
          ...renewSubscriptionInfo,
          accountId: selectedBank?._id,
          bankSlip,
        })
      );
      router.push("/dashboard/subscription");
    } else {
      toast.error("Please add bank slip and select a bank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Image height={50} width={50} src="/gif/spinner.gif" alt="Loading..." />
      </div>
    );
  }
  return (
    <>
      <Header title={t('Make Payment')} />
      <section className="max-w-[480px] my-30 mx-auto px-16">
        <form onSubmit={handleSubmit}>
          <div className="border rounded-xl p-2 border-primary w-[80px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start mx-auto">
            <FontAwesomeIcon icon={faLandmark} className="text-2xl" />
            Bank
          </div>

          <div className="flex items-center justify-center gap-16 my-20">
            {accounts?.bankAccounts?.map((acc) => (
              <div
                key={acc._id}
                className={`cursor-pointer ${
                  selectedBank === acc ? "opacity-100" : " opacity-25"
                }`}
                onClick={() => setSelectedBank(acc)}
              >
                <Image
                  src={`${BASE_URL}${acc.logo}`}
                  width={100}
                  height={68}
                  priority
                  alt={acc.bankName}
                />
              </div>
            ))}
          </div>

          <div className="bg-[#1F63B0] p-10 md:px-30 rounded-2xl">
            <ul>
              <li className="text-white flex justify-between items-center my-6">
              {t('Bank Name')}:
                <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                  {selectedBank?.bankName}
                </span>
              </li>
              <li className="text-white flex justify-between items-center my-6">
              {t('Account Name')}
                <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                  {selectedBank?.accountName}
                </span>
              </li>
              <li className="text-white flex justify-between items-center my-6">
              {t('Account Number')}:
                <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                  {selectedBank?.accountNumber}
                </span>
              </li>

              <li className="text-white flex justify-between items-center my-6">
              {t('Branch Name')}:
                <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                  {selectedBank?.branchName}
                </span>
              </li>
              <li className="text-white flex justify-between items-center my-6">
              {t('Routing Number')}:
                <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                  {selectedBank?.routingNumber}
                </span>
              </li>
              <li className="text-white flex justify-between items-center my-6">
              {t('Total Amount')}:
                <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                  {amount}
                </span>
              </li>
              <li className="text-white my-6 flex flex-col justify-center items-center">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBankSlipChange}
                  ref={bankSlipRef}
                />

                <div
                  className="border-[.5px] border-primary rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url(${bankSlip?.imageUrl})`,
                  }}
                >
                  <div className=" my-2 p-2 rounded-2xl border-[.5px] border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                    <div
                      className="flex flex-col justify-center items-center cursor-pointer"
                      onClick={() => bankSlipRef.current.click()}
                    >
                      <p className="text-sm text-black">{`${
                        bankSlip ? "Change" : "Upload"
                      } Bank Slip`}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center justify-between mt-80">
            <SecondaryButton
              text={t(`Can't submit`)}
              button_text={t('Talk with team')}
              link="/support"
            />
            <button type="submit" className="btn-primary">
              <FontAwesomeIcon icon={faArrowRight} />
              {t('Pay Now')}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
