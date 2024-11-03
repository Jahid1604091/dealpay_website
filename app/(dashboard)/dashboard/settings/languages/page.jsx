"use client";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListFilter, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";

export default function Languages() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div>
      <Header title="Languages" />

      <div className="md:w-[800px] mx-auto p-16">
        {/* search box */}
        <div className="my-20 relative ">
          <Search
            size={45}
            className="absolute top-16 left-10 text-slate-300"
          />
          <input
            type="search"
            className="shadow-lg w-full h-[80px] px-56 rounded-full  text-center lg:text-4xl placeholder-slate-300 z-10"
            placeholder="Search language..."
          />
        </div>

        {/* List */}
        <div className="flex justify-between items-start mb-6">
          <div></div>

          <button className="flex gap-1 items-center justify-center text-sm">
            Filter now <ListFilter size={16} className="text-primary" />
          </button>
        </div>

        <div className="flex justify-between items-center py-16 my-16 border-b-2">
          <div className="flex gap-2 items-center justify-center">
            {/* <Image
              src="/images/zovo.png"
              alt="bank"
              height={70}
              width={70}
              className="rounded-full"
            /> */}
            <div className="text-sm leading-loose">
              <h5 className="font-bold">Bangla</h5>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center py-16 my-16 border-b-2">
          <div className="flex gap-2 items-center justify-center">
            {/* <Image
              src="/images/zovo.png"
              alt="bank"
              height={70}
              width={70}
              className="rounded-full"
            /> */}
            <div className="text-sm leading-loose">
              <h5 className="font-bold">English</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
