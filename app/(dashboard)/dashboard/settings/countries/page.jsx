"use client";

import { ListFilter, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import { useGetAllCountriesQuery } from "@/app/(root)/redux/slices/authApiSlice";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/app/utils/constants";

export default function Countries() {
  const { t } = useTranslation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { data } = useGetAllCountriesQuery(loggedInUserInfo?.access_token);
  
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filter countries based on search term
  const filteredCountries = data?.countries?.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header title={t("Country List")} />

      <div className="md:w-[800px] mx-auto p-16">
        {/* Search box */}
        <div className="my-20 relative">
          <Search
            size={45}
            className="absolute top-20 left-10 text-slate-300"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            className="shadow-lg w-full h-[80px] px-56 rounded-full text-center lg:text-4xl placeholder-slate-300 z-10"
            placeholder={t("Search country...")}
          />
        </div>

        {/* Country List */}
        {filteredCountries?.length > 0 ? (
          filteredCountries.map((c) => (
            <div key={c._id} className="flex justify-between items-center py-16 my-16 border-b-2">
              <div className="flex gap-6 items-center justify-center">
                <Image
                  src={BASE_URL + c.logo}
                  alt={c.name}
                  height={50}
                  width={50}
                  className="h-[50px] w-[50px] rounded-full"
                />
                <div className="text-sm leading-loose">
                  <h5 className="font-bold capitalize">{c.name}</h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-slate-500">
            {t("No countries found")}
          </p>
        )}
      </div>
    </div>
  );
}
