"use client";

import { faArrowRight, faMobile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark,
  ChartNoAxesColumnIncreasing,
  CreditCard,
  Diff,
  Fingerprint,
  Handshake,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { BASE_URL, DOMAIN_URL } from "@/app/utils/constants";
import {
  useAddFavouriteContactMutation,
  useGetAccountToPayQuery,
  usePinCheckerMutation,
} from "@/app/(root)/redux/slices/accountApiSlice";
import { setLoggedInUserInfo } from "@/app/(root)/redux/slices/authSlice";
import { setPaymentInfo } from "@/app/(root)/redux/slices/accountSlice";

import Header from "../../components/Header";

export default function Receiver() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const searchparams = useSearchParams();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { paymentInfo } = useSelector((state) => state.account);
  const { data, isError, isLoading, isSuccess } = useGetAccountToPayQuery({
    email: searchparams.get("receiver"),
    token: loggedInUserInfo?.access_token,
  });
  const [addFavouriteContact] = useAddFavouriteContactMutation();
  const [pinChecker] = usePinCheckerMutation();

  const [amount, setAmount] = useState(0);
  const [purpose, setPurpose] = useState("business");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const [coupon, setCoupon] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check pin
    const res = await pinChecker({
      data: {
        pin: password,
        userId: loggedInUserInfo?.user?._id,
        receiverId:data?.user?._id,
      },
      token: loggedInUserInfo?.access_token,
    }).unwrap();

    if (res?.success) {
      if (amount < 10) {
        toast.dismiss();
        toast.warn("Amount can not be too low");
      } else {
        if (purpose && paymentMethod) {
          dispatch(
            setLoggedInUserInfo({
              ...loggedInUserInfo,
              payToken: res?.payToken,
            })
          );
          dispatch(
            setPaymentInfo({
              ...paymentInfo,
              paymentType: paymentMethod,
              amount,
              coupon,
              reference,
              purpose,
              callbackUrl:DOMAIN_URL,
              receiverId:data?.user?._id,
            })
          );
          router.push(`/dashboard/payment/checkout/${paymentMethod}`);
        } else {
          toast.dismiss();
          toast.warn("Please fill all the required field!");
        }
      }
    } else {
      toast.dismiss();
      toast.error(res?.msg);
    }
  };

  const handleAddfavrt = async (id) => {
    const res = await addFavouriteContact({
      data: { favouriteUserId: id },
      token: loggedInUserInfo?.access_token,
    }).unwrap();
    if (res.success) {
      toast.dismiss();
      toast.success(res.msg);
      dispatch(setPaymentInfo({ ...paymentInfo, isFavrt: true }));
    } else {
      toast.dismiss();
      toast.error(res.msg);
    }
  };

  return (
    <>
      <Header title={t("Make Payment")} />
      <div className="md:w-[800px] w-full mx-auto p-16 my-30">
        <form onSubmit={handleSubmit}>
          <div>
            <p className="border-b-2 border-slate-300 flex items-center w-[80px] text-sm">
              <Bookmark size={18} /> {t("Receiver")}
            </p>

            {data?.user && (
              <div className="flex justify-between items-start gap-6">
                <div className="flex gap-3 items-start justify-center my-20">
                  <Image
                    src={BASE_URL +data?.user?.profilePicture}
                    alt="person"
                    height={64}
                    width={64}
                    className="rounded-full h-[64px] w-[64px]"
                  />
                  <div>
                    <h6 className="text-md font-semibold">
                      {data?.user?.name}
                    </h6>
                    <p className="text-sm font-light">
                      {data?.user?.number ||
                       data?.user?.email}
                    </p>

                    <p className="text-sm font-light">
                      {t("Type")} :
                      {data?.user?.type || "No Type Found"}
                    </p>
                  </div>
                  <div className={`${paymentInfo?.isFavrt && "text-primary"}`}>
                    <ShieldCheck />
                  </div>
                </div>
                {!paymentInfo?.isFavrt && (
                  <div
                    className={`cursor-pointer ${
                      paymentInfo?.isFavrt && "text-primary"
                    }`}
                    onClick={() => handleAddfavrt(data?.user?._id)}
                  >
                    <Bookmark />
                  </div>
                )}
              </div>
            )}

            <div className="my-10 md:w-1/3">
              <label className="border-b-[1px] text-xl text-secondary border-primary">
                {t("Enter amount")}
              </label>
              <input
                type="number"
                className="mt-2 text-secoundary w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("Enter amount")}
              />
            </div>

            <div className="my-10">
              <label className="border-b-[1px] text-xl text-secondary border-primary">
                {t("Purpose")}
              </label>
              <div className="my-10 flex flex-wrap gap-26 justify-start items-center">
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => setPurpose("business")}
                >
                  <div
                    className={`${
                      purpose === "business" && "bg-primary text-white"
                    }  w-[66px] h-[66px] p-4 rounded-md`}
                  >
                    <Handshake size={55} />
                  </div>
                  <p className="text-xs">{t("Business Deal")}</p>
                </div>
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => setPurpose("investment")}
                >
                  <div
                    className={`${
                      purpose === "investment" && "bg-primary text-white"
                    }  w-[66px] h-[66px] p-4 rounded-md`}
                  >
                    <ChartNoAxesColumnIncreasing size={55} />
                  </div>
                  <p className="text-xs">{t("Investment")}</p>
                </div>
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => setPurpose("roi")}
                >
                  <div
                    className={`${
                      purpose === "roi" && "bg-primary text-white"
                    }  w-[66px] h-[66px] p-4 rounded-md`}
                  >
                    <TrendingUp size={55} />
                  </div>
                  <p className="text-xs">{t("ROI")}</p>
                </div>
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => setPurpose("regular")}
                >
                  <div
                    className={`${
                      purpose === "regular" && "bg-primary text-white"
                    }  w-[66px] h-[66px] p-4 rounded-md`}
                  >
                    <ShoppingCart size={55} />
                  </div>
                  <p className="text-xs">{t("Regular")}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="border-b-[1px] text-xl text-secondary border-primary flex gap-1 justify-start items-center">
                <CreditCard />
                {t("Method")}
              </label>

              <div className="flex justify-start items-center gap-16 mt-3 mb-10">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mfs")}
                  className={`border rounded-xl p-2 ${
                    paymentMethod === "mfs" && "bg-primary text-white"
                  } border-primary w-[80px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <FontAwesomeIcon icon={faMobile} className="text-2xl" />
                  MFS
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`border rounded-xl p-2 ${
                    paymentMethod === "bank" && "bg-primary text-white"
                  } border-primary w-[80px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <Landmark />
                  Bank
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("others")}
                  className={`border rounded-xl p-2 ${
                    paymentMethod === "others" && "bg-primary text-white"
                  } border-primary w-[80px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center text-start`}
                >
                  <Diff />
                  others
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 my-20">
              <div>
                <p className="border-b-[1px] text-xl text-secondary border-primary">
                  {t("Reference")}
                </p>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Type Here"
                />
              </div>
              <div>
                <p className="border-b-[1px] text-xl text-secondary border-primary">
                  {t("Coupon Apply")}
                </p>
                <div className="text-sm text-slate-400">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Type Here"
                  />
                </div>
              </div>
              <div>
                <p className="border-b-[1px] text-xl text-secondary border-primary flex gap-1 justify-start items-center">
                  <ShieldAlert size={18} /> {t("Enter your pin")}
                </p>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="XXXX"
                  />
                </div>
              </div>
              {/* <div>
                <p className="border-b-[1px] text-xl text-secondary border-primary">
                  {t("or use Quick pass")}
                </p>
                <Fingerprint size={25} />
              </div> */}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <SecondaryButton
              text={t(`Can't submit`)}
              button_text={t("Talk with team")}
              link="/support"
            />
            <button type="submit" className="btn-primary">
              <FontAwesomeIcon icon={faArrowRight} />
              <p>{t("Continue")}</p>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
