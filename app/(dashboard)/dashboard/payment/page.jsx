"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Bookmark,
  History,
  ScanBarcode,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { isBangladeshiPhoneNumber, isEmail } from "@/app/utils/helpers";
import {
  useGetFavouriteContactQuery,
  useLazyGetAccountToPayByQRQuery,
  useLazyGetAccountToPayQuery,
  useRemoveFavouriteContactMutation,
} from "@/app/(root)/redux/slices/accountApiSlice";
import { BASE_URL } from "@/app/utils/constants";

import Header from "../components/Header";
import { setPaymentInfo } from "@/app/(root)/redux/slices/accountSlice";
import { useGetRecentTransactionsQuery } from "@/app/(root)/redux/slices/transactionApiSlice";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

export default function PaymentStep1() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { paymentInfo } = useSelector((state) => state.account);
  const [triggerGetAccountToPay, { data, isError, isLoading, isSuccess }] =
    useLazyGetAccountToPayQuery();
  const [triggerGetAccountToPayByQR] = useLazyGetAccountToPayByQRQuery();
  const { data: favContacts } = useGetFavouriteContactQuery(
    loggedInUserInfo?.access_token
  );
  const { data: recentTransactions } = useGetRecentTransactionsQuery(
    loggedInUserInfo?.access_token
  );
  const [removeFavouriteContact] = useRemoveFavouriteContactMutation();
  //number or email
  const [number, setNumber] = useState("");
  const [userToPay, setUserToPay] = useState(paymentInfo?.userToPay || null);
  const [showQrCodeScanner, setShowQrCodeScanner] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isBangladeshiPhoneNumber(number) || isEmail(number)) {
      try {
        const res = await triggerGetAccountToPay({
          email: number,
          token: loggedInUserInfo?.access_token,
        }).unwrap();
        toast.dismiss();
        setUserToPay(res.user);
        if (res.success) {
          //check if already in fav List
          const user = favContacts?.users?.find(
            (con) => con?._id == res?.user?._id
          );
          if (user) {
            dispatch(
              setPaymentInfo({
                ...paymentInfo,
                userToPay: res?.user,
                isFavrt: true,
              })
            );
          } else {
            dispatch(
              setPaymentInfo({
                ...paymentInfo,
                userToPay: res?.user,
                isFavrt: false,
              })
            );
            toast.success(res?.msg);
          }
        } else {
          dispatch(
            setPaymentInfo({
              ...paymentInfo,
              userToPay: res?.user,
              isFavrt: false,
            })
          );
          toast.error(res?.msg);
        }
      } catch (error) {
        setUserToPay(null);
        toast.dismiss();
        toast.error(error?.data?.msg || "Something went wrong");
      }
    } else {
      setUserToPay(null);
      toast.dismiss();
      toast.warn("Please enter a valid number or email");
    }
  };

  const handleClick = (contact = null) => {
    if (contact) {
      router.push(`/dashboard/payment/receiver?receiver=${contact}`);
    } else {
      router.push(
        `/dashboard/payment/receiver?receiver=${
          userToPay?.email || userToPay?.number
        }`
      );
    }
  };

  const handleSetUserToPay = (user) => {
    setUserToPay(user);
    // dispatch(
    //   setPaymentInfo({
    //     ...paymentInfo,
    //     userToPay: user,
    //     isFavrt: true,
    //   })
    // );
    console.log(user)

    handleClick('');
  };

  const handleRmvfavrt = async (id) => {
    const res = await removeFavouriteContact({
      data: { favouriteUserId: id },
      token: loggedInUserInfo?.access_token,
    }).unwrap();
    if (res.success) {
      toast.dismiss();
      toast.success(res.msg);
    } else {
      toast.dismiss();
      toast.error(res.msg);
    }
  };
  let qrCodeScanner;

  const startQrScanner = () => {
    qrCodeScanner = new Html5Qrcode("qr-reader"); // Html5Qrcode instance
    qrCodeScanner.start(
      { facingMode: "environment" }, // Use back camera
      { fps: 10, qrbox: { width: 300, height: 300 } },
      handleSuccess,
      handleError
    );
  };

  // Handle successful scan
  const handleSuccess = async (decodedText) => {
    const lastPart = decodedText?.split("/")?.pop();
    try {
      const res = await triggerGetAccountToPayByQR({
        id: lastPart,
        token: loggedInUserInfo?.access_token,
      }).unwrap();
      toast.dismiss();
      setUserToPay(res.user);
      if (res.success) {
        //check if already in fav List
        const user = favContacts?.users?.find(
          (con) => con?._id == res?.user?._id
        );
        if (user) {
          dispatch(
            setPaymentInfo({
              ...paymentInfo,
              userToPay: res?.user,
              isFavrt: true,
            })
          );
        } else {
          dispatch(
            setPaymentInfo({
              ...paymentInfo,
              userToPay: res?.user,
              isFavrt: false,
            })
          );
          toast.success(res?.msg);
        }
      } else {
        dispatch(
          setPaymentInfo({
            ...paymentInfo,
            userToPay: res?.user,
            isFavrt: false,
          })
        );
        toast.error(res?.msg);
      }
    } catch (error) {
      setUserToPay(null);
      toast.dismiss();
      toast.error(error?.data?.msg || "Something went wrong");
    }

    setShowQrCodeScanner(false); // Hide scanner

    // Stop the QR scanner after success
    if (qrCodeScanner) {
      qrCodeScanner.stop().then(() => {
        qrCodeScanner.clear(); // Clean up UI after stopping
      });
    }
  };

  // Handle scan error
  const handleError = (err) => {
    console.error("QR code scan error:", err);
  };

  // Manage scanner start/stop based on `showQrCodeScanner` state
  useEffect(() => {
    if (showQrCodeScanner) {
      startQrScanner();
    }
    // Cleanup when the scanner is stopped
    return () => {
      if (qrCodeScanner) {
        qrCodeScanner.stop().then(() => qrCodeScanner.clear());
      }
    };
  }, [showQrCodeScanner]);

  return (
    <>
      <Header title={t("Make Payment")} />
      <div className="md:w-[800px] w-full mx-auto px-16">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm my-12">
              {t("Enter user number/email or scan QR to pay")}
            </p>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="border border-primary rounded-2xl py-2 px-16 w-full max-w-[350px] h-[50px] mb-6"
            />
            <input
              disabled={isLoading && true}
              type="submit"
              className="btn-primary mx-auto mb-10 cursor-pointer"
              value={isLoading ? "Searching..." : "Search"}
            />
            <button
              type="button"
              onClick={() => setShowQrCodeScanner(!showQrCodeScanner)}
              className="btn-primary mx-auto my-16"
            >
              <ScanBarcode />
              {t("Scan QR to Pay")}
            </button>

            {showQrCodeScanner && (
              <div
                id="qr-reader"
                style={{ width: "300px", height: "300px" }}
              ></div>
            )}
          </div>
        </form>

        {isLoading ? (
          <div className="my-6 px-4">Fetching User...</div>
        ) : (
          <>
            {userToPay && (
              <button onClick={()=>handleSetUserToPay(userToPay)}>
                <div className="flex justify-center items-start gap-6 my-30">
                  <Image
                    src={BASE_URL + userToPay?.profilePicture}
                    alt="person"
                    height={50}
                    width={50}
                    className="h-[50px] w-[50px] rounded-full"
                  />
                  <div className="text-start">
                    <h6 className="text-md font-semibold">{userToPay?.name}</h6>
                    <p className="text-sm font-light">
                      {userToPay?.number || userToPay?.email}
                    </p>
                    <p className="text-sm font-light">
                      Type : {userToPay?.type}
                    </p>
                  </div>
                  <div className={paymentInfo?.isFavrt ? "text-primary" : ""}>
                    <ShieldCheck />
                  </div>
                </div>
              </button>
            )}
          </>
        )}

        <div className="my-30">
          <div className="flex justify-between items-center">
            <p className="border-b-2 border-slate-300 flex items-center justify-center text-sm">
              <History size={18} /> {t("Recent Transaction")}
            </p>
            <button className="bg-black text-white rounded-full p-1 text-sm shadow-md flex items-center justify-center">
              {" "}
              <ArrowRight size={18} /> View All
            </button>
          </div>
          {recentTransactions?.transactions?.length > 0 ? (
            <div className="flex items-center -space-x-30">
              {recentTransactions?.transactions?.map((trx) => (
                <div key={trx._id}>
                  <img
                    alt="user 1"
                    src={`${
                      trx.person.picture ||
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
                    } `}
                    className="relative inline-block h-60 w-60 rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10"
                  />
                </div>
              ))}
              {recentTransactions?.transactions?.length > 5 && (
                <div className="relative  h-60 w-60 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xl font-semibold">
                  {+recentTransactions?.transactions?.length - 5}+
                </div>
              )}
            </div>
          ) : (
            "No Transaction yet"
          )}

          {/* <img
              alt="user 4"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1287&amp;q=80"
              className="relative inline-block h-60 w-60 rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10"
            /> */}
          <div className="my-30 ">
            <div className="flex items-center justify-between">
              <p className="border-b-2 border-slate-300 flex items-center justify-between w-[155px] text-sm">
                <Bookmark size={18} /> {t("Favourite Contacts")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-20">
              {favContacts?.users.length > 0
                ? favContacts?.users.map((cont) => (
                    <div
                      key={cont._id}
                      className="flex md:justify-start items-start gap-6"
                    >
                      <Image
                        src={BASE_URL + cont.picture}
                        alt={cont.name}
                        height={50}
                        width={50}
                        className="h-[50px] w-[50px] rounded-full"
                      />

                      <div>
                        <div
                          onClick={() => handleClick(cont.contact)}
                          className="cursor-pointer"
                        >
                          <h6 className="text-md font-semibold">{cont.name}</h6>
                          <p className="text-sm font-light">{cont.contact}</p>
                          <p className="text-sm font-light">
                            Type : {cont.type}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRmvfavrt(cont._id)}
                          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <ShieldCheck />
                      </div>
                    </div>
                  ))
                : "No Favrourite contact added"}
            </div>
          </div>

          <button type="button" className="btn-primary mx-auto">
            <ArrowRight />
            View All
          </button>
        </div>
      </div>
    </>
  );
}
