"use client";

import { ListFilter, Search } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { useLazyGetTransactionBySystmeIdQuery } from "@/app/(root)/redux/slices/transactionApiSlice";
import Header from "../../components/Header";
import TrackList from "../../components/Transaction/TrackList";

export default function Ekyc() {
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
      <div className="md:w-[1000px] mx-auto p-16">
        <div className="flex justify-between items-center py-16 my-16 border-b-2">
          { <TrackList transactionData={transactionData} />}
        </div>
      </div>
    </>
  );
}
