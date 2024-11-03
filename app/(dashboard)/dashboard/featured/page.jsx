"use client";

import { ListFilter, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import { featuredData } from "../../../utils/data/featuredData";

export default function Featured() {
  const { t } = useTranslation();

  // State to hold search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filter featured data based on search input
  const filteredFeatured = featuredData.filter((data) =>
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header title={t("Featured")} />
      <div className="md:w-[800px] mx-auto">
        {/* search box */}
        <div className="my-20 relative">
          <Search size={45} className="absolute top-20 left-10 text-slate-300" />
          <input
            type="search"
            value={searchTerm} // Bind input value to state
            onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
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

        {/* Render filtered featured data */}
        {filteredFeatured.length > 0 ? (
          filteredFeatured.map((data) => (
            <div key={data.id} className="flex justify-between items-center py-16 my-16 border-b-2">
              <div className="flex gap-6 items-start justify-center">
                <Image
                  src="/images/zovo.png"
                  alt={data.name}
                  height={70}
                  width={70}
                  className="rounded-full"
                />
                <div className="text-sm mt-2">
                  <h5 className="font-bold">{data.name}</h5>
                  <p className="font-thin">{data.type}</p>
                  <p className="font-semibold">
                    Rating: <span className="text-primary">{data.rating}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-slate-500">
            {t("No featured items found")}
          </p>
        )}
      </div>
    </>
  );
}
