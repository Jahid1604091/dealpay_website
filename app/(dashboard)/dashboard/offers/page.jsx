"use client";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Copy,
  ListFilter,
  RotateCcw,
  Search,
  TicketPercent,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Pagination, Controller, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

export default function Offers() {
  const router = useRouter();
  const {t} = useTranslation();
  return (
    <>
      <Header title={t('Offers')} />

      <div className="md:w-[800px] mx-auto">
        {/* search box */}
        <div className="my-20 relative ">
          <Search size={45} className="absolute top-16 left-10 text-slate-300" />
          <input
            type="search"
            className="shadow-lg w-full h-[80px] px-56 rounded-full  text-center lg:text-4xl placeholder-slate-300 z-10"
            placeholder={t('Search name')}
          />
        </div>

        {/* Slider */}
        <div className="my-4">
          <Swiper
            modules={[Pagination, Controller,Autoplay]}
            spaceBetween={5}
            slidesPerView={2}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
          >
            <SwiperSlide className="">
              <Image
                src="/images/slider1.png"
                alt="slider1"
                height={150}
                width={150}
                className="w-full h-[120px] object-cover"
              />
            </SwiperSlide>
            <SwiperSlide className="">
              <Image
                src="/images/slider2.png"
                alt="slider2"
                height={150}
                width={150}
                className="w-full h-[120px] object-cover"
              />
            </SwiperSlide>
            <SwiperSlide className="">
              <Image
                src="/images/slider3.png"
                alt="slider3"
                height={150}
                width={150}
                className="w-full h-[120px] object-cover"
              />
            </SwiperSlide>
            <SwiperSlide className="">
              <Image
                src="/images/slider4.png"
                alt="slider4"
                height={150}
                width={150}
                className="w-full h-[120px] object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>
        {/* List */}
        <div className="flex justify-between items-start mb-6">
          <div></div>

          <button className="flex gap-1 items-center justify-center text-sm">
            <ListFilter size={16} /> Filter now
          </button>
        </div>

        <div className="flex justify-between items-start  border-b-2 my-16 py-16">
          <div className="flex gap-2 items-start justify-center">
            <Image src="/images/zovo.png" alt="bank" height={60} width={60} />
            <div className="text-sm">
              <h5 className="font-semibold">Zovo team Ltd.</h5>
              <p className="font-thin">
                B2B Partner <span className="mx-4">{t('Type')}: IT/ITES</span>
              </p>
              <p className="text-primary font-semibold flex items-center justify-between">
                Coupon : zovo20{" "}
                <span className="text-black cursor-pointer">
                  <Copy size={16} />
                </span>
              </p>
            </div>
          </div>

          <div className="text-end font-thin text-sm">
            <p className="font-semibold">20% OFF</p>
            <p>07/05/2024 to 17/05/2024</p>
            <button className="capitalize font-extralight shadow-sm p-1">
              view more
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start  border-b-2 my-16 py-16">
          <div className="flex gap-2 items-start justify-center">
            <Image src="/images/zovo.png" alt="bank" height={60} width={60} />
            <div className="text-sm">
              <h5 className="font-semibold">Zovo team Ltd.</h5>
              <p className="font-thin">
                B2B Partner <span className="mx-4">{t('Type')}: IT/ITES</span>
              </p>
              <p className="text-primary font-semibold flex items-center justify-between">
                Coupon : zovo20{" "}
                <span className="text-black cursor-pointer">
                  <Copy size={16} />
                </span>
              </p>
            </div>
          </div>

          <div className="text-end font-thin text-sm">
            <p className="font-semibold">20% OFF</p>
            <p>07/05/2024 to 17/05/2024</p>
            <button className="capitalize font-extralight shadow-sm p-1">
              view more
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start  border-b-2 my-16 py-16">
          <div className="flex gap-2 items-start justify-center">
            <Image src="/images/zovo.png" alt="bank" height={60} width={60} />
            <div className="text-sm">
              <h5 className="font-semibold">Zovo team Ltd.</h5>
              <p className="font-thin">
                B2B Partner <span className="mx-4">{t('Type')}: IT/ITES</span>
              </p>
              <p className="text-primary font-semibold flex items-center justify-between">
                Coupon : zovo20{" "}
                <span className="text-black cursor-pointer">
                  <Copy size={16} />
                </span>
              </p>
            </div>
          </div>

          <div className="text-end font-thin text-sm">
            <p className="font-semibold">20% OFF</p>
            <p>07/05/2024 to 17/05/2024</p>
            <button className="capitalize font-extralight shadow-sm p-1">
              view more
            </button>
          </div>
        </div>


      </div>
    </>
  );
}
