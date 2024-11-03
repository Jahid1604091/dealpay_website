"use client";

import React, { useEffect, useState } from "react";
import {
  faArrowRight,
  faCheck,
  faLandmark,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, DiffIcon, RefreshCcw, TicketPercent } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Header from "@/app/(root)/components/Header";
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import {
  setStep,
  setSubscriptionInfo,
} from "@/app/(root)/redux/slices/authSlice";
import {
  useGetAllSubscriptionsQuery,
  useRegViaPassportMutation,
} from "@/app/(root)/redux/slices/authApiSlice";

export default function Subscription() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { info, subscriptionInfo, countryId } = useSelector(
    (state) => state.auth
  );
  const { data } = useGetAllSubscriptionsQuery(countryId);
  const [regViaPassport] = useRegViaPassportMutation();
  const [currentSubscription, setCurrentSubscription] = useState(
    subscriptionInfo?.currentSubscription || null
  );

  const [paymentType, setPaymentType] = useState(
    subscriptionInfo?.paymentType || null
  );
  
  const [coupon, setCoupon] = useState(subscriptionInfo?.coupon || "");
  const [reference, setReference] = useState(subscriptionInfo?.reference || "");
  const [isAgreed, setIsAgreed] = useState(subscriptionInfo?.isAgreed || false);
  const [userId,setUserId] = useState('')

  useEffect(()=>{
    setUserId(searchParams?.get('userId'))
  },[])

  const handlePaymentType = (type) => {
    if (currentSubscription) {
      setPaymentType(type);
      dispatch(
        setSubscriptionInfo({
          ...subscriptionInfo,
          currentSubscription,
          paymentType: type,
          isAgreed,
          coupon,
        })
      );
      router.push(`/payment/${type}`);
    } else {
      toast.warn("Please select a subscription");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (info?.accountType == "personal" && (subscriptionInfo?.userId || userId)) {
      const formData = new FormData();
      const refinedData = {
        accounType: info.accountType,
        name: info.name,
        gender: info.gender,
        address: info.address,
        profession: info.profession,
        currencyId: info.currencyId,
        currencyId2: info.currencyId2,
        isNid: info.isNid,
        pin: info.pin,
        coupon,
        reference,
      };
      formData.append("info", JSON.stringify(refinedData));
      if (info.isNid) {
        formData.append("profilepicture", info.yourPic.file);
        formData.append("nid", info.kyc_personal_front_pic.file);
        formData.append("nid", info.kyc_personal_back_pic.file);
      } else {
        formData.append("profilepicture", info.yourPic.file);
        formData.append("passport", info.kyc_personal_front_pic.file);
        console.log("Personal FormData");
      }
      try {
        const res = await regViaPassport({
          data: formData,
          userId: subscriptionInfo?.userId || userId,
          accType: info?.accountType,
        }).unwrap();

        if (res.success) {
          toast.success(res.msg);
          dispatch(setStep(5));
          // router.push("/auth/signup/submited");
        }
      } catch (error) {
        console.log(`Error in signup ${error}`);
      }
    } else if (info?.accountType == "business" && (subscriptionInfo?.userId || userId)) {
      const formData = new FormData();

      const refinedData = {
        accounType: info.accountType,
        businessName: info.name,
        legalType: info.legalType,
        registeredAddress: info.address,
        category: info.category,
        currencyId: info.currencyId,
        currencyId2: info.currencyId2,
        isNid: info.isNid,
        pin: info.pin,
        representativeName: info.representativeName,
        designation: info.designation,
        coupon,
        reference,
      };
      formData.append("info", JSON.stringify(refinedData));
      if (info.isNid) {
        formData.append("nid", info.kyc_personal_front_pic.file);
        formData.append("nid", info.kyc_personal_back_pic.file);
        formData.append("profilepicture", info.yourPic.file);
        formData.append("tradelicences", info.tradePic1.file);
        formData.append("tradelicences", info.tradePic2.file);
        formData.append("tradelicences", info.tradePic3.file);
        formData.append("tradelicences", info.tradePic4.file);
        formData.append("logo", info.logoPic.file);
      } else {
        formData.append("passport", info.kyc_personal_front_pic.file);
        formData.append("profilepicture", info.yourPic.file);
        formData.append("tradelicences", info.tradePic1.file);
        formData.append("tradelicences", info.tradePic2.file);
        formData.append("tradelicences", info.tradePic3.file);
        formData.append("tradelicences", info.tradePic4.file);
        formData.append("logo", info.logoPic.file);
      }
      try {
        const res = await regViaPassport({
          data: formData,
          userId: subscriptionInfo?.userId || userId,
          accType: info?.accountType,
        }).unwrap();

        if (res.success) {
          toast.success(res.msg);
          dispatch(setStep(5));
          // router.push("/auth/signup/submited");
        }
      } catch (error) {
        console.log(`Error in signup ${error}`);
      }
    } else {
      toast.error("Plase process all, agree to the terms and subscribe first");
    }
  };

  return (
    <>
      <Header title={t("Subscription")} />
      <section className="max-w-[480px] my-30 mx-auto p-16">
        <form onSubmit={handleSubmit}>
          {/* Plan Portion */}
          <p className="text-primary flex gap-2 justify-start items-center border-b-[1px] w-[180px] text-sm">
            <RefreshCcw size={18} />
            {t("Select Plan")}
          </p>

          {/* if subscribed already */}
          {subscriptionInfo?.userId || userId ? (
            <>
              <div className="flex gap-16 justify-start items-center mt-3 my-20">
                {data?.subscriptions.map((sub) => (
                  <button
                    key={sub._id}
                    type="button"
                    onClick={() => toast.warn("You are already subscribed")}
                    className={`border rounded-xl p-6 ${
                      currentSubscription?._id == sub._id && "bg-primary text-white"
                    }  w-[85px] h-[85px] text-sm flex justify-start items-center text-start`}
                  >
                    {sub.name} {sub.price} {sub.currencyName}
                  </button>
                ))}
              </div>

              {/* Coupon Portion */}
              <p className="text-primary flex gap-2 justify-start items-center border-b-[1px] w-[180px] text-sm text-start">
                <TicketPercent size={18} />
                {t("Refer/coupon")}
              </p>
              <div className="relative mt-3 mb-10">
                <input
                  onClick={() => toast.warn("You already subscribed!")}
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-[225px] px-10 border rounded-full p-2 border-primary"
                />
                {coupon?.length > 5 && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="absolute top-1 left-190 text-xl text-primary"
                  />
                )}
              </div>

              {/* Payment Portion */}
              <p className="text-primary border-b-[1px] w-[180px] text-sm text-start flex justify-start items-center gap-2">
                <CreditCard size={18} />
                Payment
              </p>

              <div className="flex justify-start items-center gap-16 mt-3 my-20">
                <button
                  type="button"
                  onClick={() => toast.warn("You already subscribed!")}
                  className={`border rounded-xl p-2 border-primary ${
                    paymentType == "mfs" && "bg-primary text-white"
                  } w-[86px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <FontAwesomeIcon icon={faMobile} className="text-2xl" />
                  MFS
                </button>

                <button
                  type="button"
                  onClick={() => toast.warn("You already subscribed!")}
                  className={`border rounded-xl p-2 border-primary ${
                    paymentType == "bank" && "bg-primary text-white"
                  } w-[86px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <FontAwesomeIcon icon={faLandmark} className="text-2xl" />
                  Bank
                </button>

                <button
                  type="button"
                  onClick={() => toast.warn("You already subscribed!")}
                  className={`border rounded-xl p-2 border-primary ${
                    paymentType == "others" && "bg-primary text-white"
                  } w-[86px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <DiffIcon size={18} />
                  others
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-16 justify-start items-center mt-3 my-20">
                {data?.subscriptions?.map((sub) => (
                  <button
                    key={sub._id}
                    type="button"
                    onClick={() => setCurrentSubscription(sub)}
                    className={`border rounded-xl p-6 ${
                      currentSubscription?._id == sub._id && "bg-primary text-white"
                    }  w-[85px] h-[85px] text-sm flex justify-start items-center text-start`}
                  >
                    {sub.name} {sub.price} {sub.currencyName}
                  </button>
                ))}
              </div>

              {/* Coupon Portion */}
              <p className="text-primary flex gap-2 justify-start items-center border-b-[1px] w-[180px] text-sm text-start">
                <TicketPercent size={18} />
                {t("Refer/coupon")}{" "}
              </p>
              <div className="relative mt-3 mb-10">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-[225px] px-10 border rounded-full p-2 border-primary"
                />
                {coupon?.length > 5 && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="absolute top-1 left-190 text-xl text-primary"
                  />
                )}
              </div>

              {/* Payment Portion */}
              <p className="text-primary border-b-[1px] w-[180px] text-sm text-start flex justify-start items-center gap-2">
                <CreditCard size={18} />
                Payment
              </p>

              <div className="flex justify-start items-center gap-16 mt-3 my-20">
                <button
                  type="button"
                  onClick={() => handlePaymentType("mfs")}
                  className={`border rounded-xl p-2 border-primary ${
                    paymentType == "mfs" && "bg-primary text-white"
                  } w-[86px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <FontAwesomeIcon icon={faMobile} className="text-2xl" />
                  MFS
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentType("bank")}
                  className={`border rounded-xl p-2 border-primary ${
                    paymentType == "bank" && "bg-primary text-white"
                  } w-[86px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <FontAwesomeIcon icon={faLandmark} className="text-2xl" />
                  Bank
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentType("others")}
                  className={`border rounded-xl p-2 border-primary ${
                    paymentType == "others" && "bg-primary text-white"
                  } w-[86px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <DiffIcon size={18} />
                  others
                </button>
              </div>
            </>
          )}

          {/* Agreement box */}
          <label className="flex gap-2 justify-center items-center cursor-pointer mt-20">
            <input
              required
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              type="checkbox"
              className="mr-2 h-[30px] w-[30px] rounded-md"
            />
            <p className="text-sm leading-tight">
              {t(`I Agree to DEALPAY ASIA's`)}{" "}
              <strong>{t("Terms & Conditions")}</strong> {t("and")}{" "}
              <strong>{t('"Privacy Policy')}</strong>.
            </p>
          </label>
          <div className="flex flex-col md:flex-row gap-16 md:gap-2 items-center justify-between mt-2">
            <SecondaryButton
              text={t(`Can't submit`)}
              button_text={t("Talk with team")}
              link={"/support"}
            />
            <button disabled={!isAgreed} type="submit" className="btn-primary">
              <FontAwesomeIcon icon={faArrowRight} /> {t("Submit")}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
