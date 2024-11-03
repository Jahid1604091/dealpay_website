"use client";
import { ListFilter, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { partnersData } from '../../../utils/data/partnersData';

export default function Partners() {
  const { t } = useTranslation();
  
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filter partners based on the search term
  const filteredPartners = partnersData.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header title={t("Partners")} />

      <div className="md:w-[800px] mx-auto">
        {/* search box */}
        <div className="my-20 relative">
          <Search size={45} className="absolute top-20 left-10 text-slate-300" />
          <input
            type="search"
            value={searchTerm} // Bind the input value to searchTerm
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm when input changes
            className="shadow-lg w-full h-[80px] px-56 rounded-full text-center lg:text-4xl placeholder-slate-300 z-10"
            placeholder={t("Search name")}
          />
        </div>

        {/* List */}
        <div className="flex justify-between items-start mb-6">
          <div></div>
          <button className="flex gap-1 items-center justify-center text-sm">
            {t("Filter now")} <ListFilter size={16} className="text-primary" />
          </button>
        </div>

        {/* Render filtered partners */}
        {filteredPartners.length > 0 ? (
          filteredPartners.map((data) => (
            <div key={data.id} className="flex justify-between items-center py-16 my-16 border-b-2">
              <div className="flex gap-6 items-start justify-center">
                <Image
                  src="/images/zovo.png"
                  alt="bank"
                  height={60}
                  width={60}
                  className="rounded-full"
                />
                <div className="text-sm mt-6">
                  <h5 className="font-semibold">{data.name}</h5>
                  <p className="font-thin">{data.desc}</p>
                </div>
              </div>
              <div className="text-end font-thin text-sm">
                <button className="capitalize font-extralight shadow-sm p-1">
                  {t("view offer")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-slate-500">
            {t("No partners found")}
          </p>
        )}
      </div>
    </>
  );
}
