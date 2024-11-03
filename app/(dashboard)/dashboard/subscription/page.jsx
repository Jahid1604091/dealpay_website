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
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, DiffIcon, RefreshCcw, TicketPercent } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { setRenewSubscriptionInfo } from "@/app/(root)/redux/slices/authSlice";
import {
  useGetAllCurrenciesQuery,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionValidityQuery,
  useSubscriptionRenewMutation,
} from "@/app/(root)/redux/slices/authApiSlice";
import Header from "../components/Header";
import { formatDays } from "@/app/utils/helpers";

export default function Subscription() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { renewSubscriptionInfo, loggedInUserInfo } = useSelector(
    (state) => state.auth
  );
  const { data } = useGetAllSubscriptionsQuery(loggedInUserInfo?.user?.country);
  const { data: currency } = useGetAllCurrenciesQuery(
    loggedInUserInfo?.access_token
  );
  const { data: subscriptionValidity } = useGetSubscriptionValidityQuery(
    loggedInUserInfo?.access_token
  );
  const [subscriptionRenew] = useSubscriptionRenewMutation();
  const [currentSubscription, setCurrentSubscription] = useState(
    renewSubscriptionInfo?.currentSubscription || null
  );
  const [paymentType, setPaymentType] = useState(
    renewSubscriptionInfo?.paymentType || null
  );
  const [coupon, setCoupon] = useState(renewSubscriptionInfo?.coupon || "");
  const [reference, setReference] = useState(
    renewSubscriptionInfo?.reference || ""
  );

  useEffect(()=>{
    if(searchParams?.get('paymentGatewayStatus') === 'success'){
      router.push("/dashboard/subscription/success");
    }
    //handle error case
    //show alert
  },[searchParams])


  const [isAgreed, setIsAgreed] = useState(
    renewSubscriptionInfo?.isAgreed || false
  );

  //go payment page
  const handlePaymentType = (type) => {
    if (currentSubscription) {
      setPaymentType(type);
      dispatch(
        setRenewSubscriptionInfo({
          ...renewSubscriptionInfo,
          currentSubscription,
          paymentType: type,
          isAgreed,
          coupon,
          reference
        })
      );
      router.push(`/dashboard/subscription/payment/${type}`);
    } else {
      toast.warn("Please select a subscription");
    }
  };

  //call renew api
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const refinedData = {
      accountId: renewSubscriptionInfo?.accountId,
      paymentType: renewSubscriptionInfo?.paymentType,
      subscriptionId: renewSubscriptionInfo?.currentSubscription?._id,
      coupon: renewSubscriptionInfo?.coupon,
      reference: renewSubscriptionInfo?.referenece,
      currencyId: renewSubscriptionInfo?.currentSubscription?.currencyId || loggedInUserInfo?.user.currency,
      transactionId: renewSubscriptionInfo?.transactionId || "",
    };

    formData.append("info", JSON.stringify(refinedData));

    //for bank , also pass bankSli[]
    if (subscriptionRenew?.paymentType === "bank") {
      formData.append("bankslip", subscriptionRenew?.bankSlip?.file);
    }

    try {
      const res = await subscriptionRenew({
        data: formData,
        userId: loggedInUserInfo?.user?._id,
      }).unwrap();

      if (res.success) {
        toast.success(res.msg);
        router.push("/dashboard/subscription/success");
      }
    } catch (error) {
      console.log(`Error in subscription renew ${error}`);
    }
  };

  return (
    <>
      <Header title="Subscription renew" />
      <section className="max-w-[480px] my-30 mx-auto px-16">
        <form onSubmit={handleSubmit}>
          {/* Plan Portion */}
          <p className="text-primary flex gap-2 justify-start items-center border-b-[1px] w-[200px] text-sm">
            <RefreshCcw size={18} />
            Remaining Subscription
          </p>
          <div className="flex gap-16 justify-start items-center mt-3 my-20">
            {formatDays(subscriptionValidity?.daysLeft)}
          </div>
          {/* Plan Portion */}
          <p className="text-primary flex gap-2 justify-start items-center border-b-[1px] w-[180px] text-sm">
            <RefreshCcw size={18} />
            {t("Select Plan")}
          </p>

          {/* if subscribed already */}
          {renewSubscriptionInfo?.userId ? (
            <>
              <div className="flex gap-16 justify-start items-center mt-3 my-20">
                {data?.subscriptions?.map((sub) => (
                  <button
                    key={sub._id}
                    type="button"
                    onClick={() => toast.warn("You are already subscribed")}
                    className={`border rounded-xl p-6 ${
                      currentSubscription?._id == sub._id && "bg-primary text-white"
                    }  w-[85px] h-[85px] text-sm flex justify-start items-center text-start`}
                  >
                    {sub.durationInYear} year {sub.price} {sub.currencyName}
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
                    {sub.durationInYear} year {sub.price} {sub.currencyName}
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
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between mt-2">
            <SecondaryButton
              text={t(`Can't submit`)}
              button_text={t("Talk with team")}
              link={"/support"}
            />
            <button disabled={!isAgreed} type="submit" className="btn-primary">
              <FontAwesomeIcon icon={faArrowRight} /> {t("Pay Now")}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
