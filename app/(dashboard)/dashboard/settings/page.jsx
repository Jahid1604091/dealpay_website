"use client";

import { Download, Link, ScanBarcode, Share2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {  useSelector } from "react-redux";
import { toast } from "react-toastify";

import { settingsMenu } from "@/app/utils/menu";
import { BASE_URL, DOMAIN_URL } from "@/app/utils/constants";
import Header from "../components/Header";
import SwitchCurrency from "../components/SwitchCurrency";

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleShare = async (type) => {
    let shareData;
    if (type === "qr") {
      shareData = {
        title: "My QR Code",
        text: "Check out my QR code!",
        url: BASE_URL + loggedInUserInfo?.user?.qrcode,
      };
    } else {
      shareData = {
        title: "My Payment Link",
        text: "Check out my Payment Link!",
        url:DOMAIN_URL+`/dashboard/payment/link?id=${loggedInUserInfo?.user?.email || loggedInUserInfo?.user?.number?.replace("+88", "")}`
      };
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      toast.warn("Web Share API not supported on this browser.");
    }
  };

  return (
    <>
      <Header title="Settings" />

      <div className="md:w-[800px] w-full mx-auto p-16">
        <div className="flex flex-col md:flex-row gap-16 items-center justify-center my-16">
          <div className="flex items-center justify-center gap-6">
            <Image
              src={BASE_URL + loggedInUserInfo?.user?.profilePicture}
              alt={loggedInUserInfo?.user?.name}
              height={60}
              width={60}
              className="rounded-full h-[60px] w-[60px]"
            />
            <div className="text-sm leading-relaxed text-center md:text-left">
              <h4 className="font-bold">{loggedInUserInfo?.user?.name}</h4>
              <p className="">
                {loggedInUserInfo?.user?.email ||
                  loggedInUserInfo?.user?.number}
              </p>
            </div>
          </div>
          <SwitchCurrency />
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center my-16 gap-6">
          <button
            onClick={() => setShowQrCode(!showQrCode)}
            className="btn-primary mb-6 lg:mb-0 rounded-3xl py-4 w-full sm:w-[350px] flex items-center justify-center gap-2 mx-auto lg:mx-0"
          >
            <ScanBarcode /> {t("My QR Code")}
          </button>

          <button
            onClick={() => handleShare("payment")}
            className="bg-slate-900 text-white font-semibold rounded-3xl py-10 w-full sm:w-[350px] flex items-center justify-center gap-2 mx-auto lg:mx-0"
          >
            <Link /> {t("My Payment link")}
          </button>
        </div>

        {/* List */}
        <div className="flex flex-wrap justify-center items-center lg:justify-between gap-6 lg:gap-20 my-16 py-16">
          {settingsMenu?.map((menu) => (
            <button
              onClick={() => router.push(menu.url)}
              key={menu.id}
              type="button"
              className="flex gap-2 items-start justify-start border-b-2 w-full sm:w-[200px] lg:w-[250px] mb-10 mx-auto"
            >
              <div className="text-sm leading-loose flex gap-6 items-center justify-center">
                {menu.icon} <h5 className="font-bold">{menu.text}</h5>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showQrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg p-20 text-end">
            <button
              className="z-100 text-red-500 hover:text-gray-700"
              onClick={() => setShowQrCode(false)}
            >
              <X />
            </button>
            <Image
              src={BASE_URL + loggedInUserInfo?.user?.qrcode}
              alt="QR Code"
              height={300}
              width={300}
              className="h-[300px] w-[300px] rounded-md"
            />
            <div className="flex justify-center items-center gap-10 mb-4">
              <a
                href={BASE_URL + loggedInUserInfo?.user?.qrcode}
                download={loggedInUserInfo?.user?._id + "qr"}
                className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2"
              >
                <Download size={16} />
              </a>
              <button
                onClick={() => handleShare("qr")}
                className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center gap-2"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
