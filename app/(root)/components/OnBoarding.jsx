import React, { useEffect, useState } from "react";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Image from "next/image";

// onboarding image
import OnBoardingImg from "@/public/images/onBoarding.png";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLang } from "../redux/slices/authSlice";

function OnBoarding() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [selectedlang, setSelctedLang] = useState("english");

  useEffect(() => {
    dispatch(setLang(selectedlang));
  }, [selectedlang]);

  return (
    <section className="flex flex-col justify-center items-center min-h-screen">
      <main className="md:w-[500px] flex justify-center flex-col min-h-[100vh]">
        <div className="mb-10 w-full gap-2">
          <div className="text-end">
            <button
              onClick={() => setSelctedLang("english")}
              className={`${
                selectedlang === "english" && "bg-secondary text-white"
              } rounded-md mr-2 px-3 py-2`}
            >
              A
            </button>
            <button
              onClick={() => setSelctedLang("bangla")}
              className={`${
                selectedlang === "bangla" && "bg-secondary text-white"
              } rounded-md mr-2 px-3 py-2`}
            >
              ক
            </button>
          </div>
        </div>

        <div className="h-300 w-300 md:h-auto md:w-auto">
          <Image
            src={OnBoardingImg}
            height={392}
            width={496}
            alt="Onboarding image Dealpay Asia LTD."
            priority
          />
          <h1 className="text-secondary text-center text-1xl md:text-3xl my-6">
            {t("Welcome to")}{" "}
            <span className="font-bold">{t("Dealpay Asia")}</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 w-full mt-20">
          <Link href={"/auth/signup"} className="btn-block">
            {t("Signup")}
          </Link>
          <Link href={"/auth/login"} className="btn">
            {t("Login")}
          </Link>
        </div>
      </main>
    </section>
  );
}

export default OnBoarding;
