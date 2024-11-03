"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const ActionButton = ({ link, btn_text, icon }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={() => router.push(link)}
        className="border rounded-xl p-2 bg-primary text-white w-[95px] h-[95px] text-sm flex justify-center items-center text-start"
      >
        <Image src={icon} width={45} height={45} alt={btn_text} />
      </button>
      <p className="text-2xl font-semibold">{t(btn_text)}</p>
    </div>
  );
};

export default ActionButton;
