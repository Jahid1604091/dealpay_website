"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { BASE_URL } from "@/app/utils/constants";
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { useGetSingleAccountQuery } from "@/app/(root)/redux/slices/authApiSlice";
import { usePayMutation } from "@/app/(root)/redux/slices/accountApiSlice";
import { setPaymentInfo } from "@/app/(root)/redux/slices/accountSlice";
import Header from "../../../components/Header";

export default function Bank() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {t} = useTranslation();

  const { paymentInfo } = useSelector((state) => state.account);
  const { countryId, loggedInUserInfo } = useSelector((state) => state.auth);
  const { data: accounts, isLoading } = useGetSingleAccountQuery(
    {userId:paymentInfo?.receiverId,token:loggedInUserInfo?.access_token}
  );
  const [pay, { isError }] = usePayMutation();

  const bankSlipRef = useRef(null);
  const [bankSlip, setBankSlip] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

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
    const formData = new FormData();

    const information = {
      accountId: selectedBank?._id,
      paymentType: paymentInfo?.paymentType,
      currencyId: loggedInUserInfo?.user.currency,
      amount: paymentInfo?.amount,
      coupon: paymentInfo?.coupon,
      reference: paymentInfo?.reference,
      purpose: paymentInfo?.purpose,
      callbackUrl: paymentInfo?.callbackUrl,
    };

    try {
      let res;
      if (information && bankSlip?.file) {
        formData.append("info", JSON.stringify(information));
        formData.append("bankslip", bankSlip.file);
        res = await pay({
          data: formData,
          userId: loggedInUserInfo?.user._id,
          receiverId: paymentInfo?.receiverId,
          payToken: loggedInUserInfo?.payToken,
          token:loggedInUserInfo?.access_token
        }).unwrap();

        if (res.success) {
          dispatch(
            setPaymentInfo({
              ...paymentInfo,
              accNumber: selectedBank?.accountNumber,
            })
          );
          toast.dismiss();
          toast.success(res.msg);
          router.push("/dashboard/payment/checkout/success");
        } else {
          toast.dismiss();
          toast.error(res.msg);
        }
      } else {
        toast.dismiss();
        toast.warn("Please fill all required field");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.data?.msg || "Something Wrong");
    }
  };

  if (!accounts?.bankAccounts) {
    return <div> User has no bank account</div>;
  }
  return (
    <>
      <Header title={t('Make Payment')} />
      <section className="max-w-[480px] my-30 mx-auto px-16">
        <form onSubmit={handleSubmit}>

        <div className="flex items-center justify-center gap-16 my-20">
            {isLoading ? (
              <div className="my-6 px-4">Fetching Bank Accounts...</div>
            ) : accounts?.bankAccounts?.length ? (
              accounts.bankAccounts.map((acc) => (
                <div
                  key={acc._id}
                  className={`cursor-pointer ${
                    selectedBank === acc ? "opacity-100" : "opacity-15"
                  }`}
                  onClick={() => setSelectedBank(acc)}
                >
                  <Image
                    src={`${BASE_URL}/${acc.logo}`}
                    width={68}
                    height={68}
                    priority
                    alt={acc.bankName}
                  />
                </div>
              ))
            ) : (
              <div className="my-6 px-4">No Bank account available.</div>
            )}
          </div>

          {accounts?.bankAccounts?.length > 0 && (
            <>
              <div className="bg-[#1F63B0] p-10 md:px-30 rounded-2xl">
                <ul>
                  <li className="text-white flex justify-between items-center my-6">
                  {t('Bank Name')} :
                    <span className="text-center bg-white text-black rounded-full p-1 w-[160px]">
                      {selectedBank?.bankName}
                    </span>
                  </li>
                  <li className="text-white flex justify-between items-center my-6">
                    {t('Account Name')}:
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
                      {paymentInfo?.amount}
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
            </>
          )}

        </form>
      </section>
    </>
  );
}
