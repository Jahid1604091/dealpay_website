"use client";

import { ListFilter, Search } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useLazyGetTransactionBySystmeIdQuery } from "@/app/(root)/redux/slices/transactionApiSlice";
import Header from "../components/Header";
import TrackList from "../components/Transaction/TrackList";

export default function Partners() {
  const { t } = useTranslation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const [triggerGetTransactionBySystmeId, { data, isLoading }] =
    useLazyGetTransactionBySystmeIdQuery();

  const [query, setQuery] = useState("");
  const [transactionData, setTransactionData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await triggerGetTransactionBySystmeId({
        token: loggedInUserInfo?.access_token,
        systemId: query?.toUpperCase(),
      }).unwrap();

      if (res.success) {
        setTransactionData(res.transaction);
      } else {
        setTransactionData(null);
      }
    } catch (error) {
      console.error("Error setting trx data:", error);
      setTransactionData(null);
    }
  };

  return (
    <>
      <Header title={t("Track")} />
      <div className="md:w-[800px] mx-auto p-16">
        <form onSubmit={handleSearch} className="my-20 relative ">
          <Search
            size={45}
            className="absolute top-20 left-10 text-slate-300"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            className="shadow-lg w-full h-[80px] px-56 rounded-full  text-center lg:text-4xl placeholder-slate-300 z-10"
            placeholder={`Enter System TrxId`}
          />
        </form>

        <div className="flex justify-between items-start mb-6">
          <div></div>
          <button className="flex gap-1 items-center justify-center text-sm">
            Filter now <ListFilter size={16} className="text-primary" />
          </button>
        </div>

        <div className="flex justify-between items-center py-16 my-16 border-b-2">
          {transactionData && <TrackList transactionData={transactionData} />}
        </div>
      </div>
    </>
  );
}
