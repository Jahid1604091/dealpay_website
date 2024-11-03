'use client'
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import TapToView from "./components/dashboard/TapTopView";
import ActionButton from "./components/dashboard/ActionButton";
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const { t } = useTranslation();


  return (
    <section className="flex gap-8 flex-col items-center justify-center ">
      {/* 1st section */}
      <div className="grid md:grid-cols-3 gap-16 my-30 shadow-lg p-6">
        <div className="flex flex-col-reverse md:flex-col items-center gap-6 my-10">
          {/* sent */}
          <h4 className="md:text-3xl font-bold">{t("Sent")}</h4>
          <TapToView amount={100} type='s' />
        </div>
        {/* total */}
        <Link href='/dashboard/settings/transaction-sheet'>
          <div className="flex flex-col items-center gap-6 my-10">
            <div className="p-8 flex flex-col items-center rounded-3xl shadow-lg border-0 h-[200px] w-[330px]">
              <Image
                src="/icons/chartAxis.svg"
                width={150}
                height={150}
                alt="Taka"
                className="w-full h-auto max-w-[150px] md:max-w-[150px] p-2"
              />
            </div>
            <h4 className="md:text-3xl font-bold mb-2 text-center">{t('Total Transaction')}</h4>
            <TapToView amount={350} type='t' />
          </div>

        </Link>

        <div className="flex flex-col-reverse md:flex-col items-center gap-6 my-10">
          {/* Received */}
          <h4 className="md:text-3xl font-bold">{t("Received")}</h4>
          <TapToView amount={400} type='r' />
        </div>

      </div>


      {/* 2nd section */}
      <div className="flex flex-wrap gap-16 justify-center items-center mt-3 mb-10">
        <ActionButton link='/dashboard/payment' btn_text="Payment" icon='/icons/tk-white.svg' />
        <ActionButton link='/dashboard/track' btn_text="Track" icon='/icons/track.svg' />
        <ActionButton link='/dashboard/subscription' btn_text="Subscribe" icon='/icons/subscribe.svg' />
        <ActionButton link='/dashboard/help' btn_text="Help" icon='/icons/help.svg' />
      </div>
    </section>
  );
}

export default Dashboard;