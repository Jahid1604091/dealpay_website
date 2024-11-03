"use client";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ChartNoAxesColumnIncreasing,
  Download,
  Handshake,
  Link,
  ScanBarcode,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { settingsMenu } from "@/app/utils/menu";
import Header from "../../components/Header";
import {
  useGetTransactionByUserQuery,
  useLazyDownloadTransactionSheetQuery,
} from "@/app/(root)/redux/slices/transactionApiSlice";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import dayjs from "dayjs";
import { BASE_URL } from "@/app/utils/constants";
import { toast } from "react-toastify";
import { useGetAllCurrenciesQuery } from "@/app/(root)/redux/slices/authApiSlice";

export default function TransactionSheet() {
  const router = useRouter();
  const { t } = useTranslation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { data: all_currencies } = useGetAllCurrenciesQuery(
    loggedInUserInfo?.access_token
  );
  const defaultToDate = dayjs().format("YYYY-MM-DD");
  const defaultFromDate = dayjs().subtract(1, "month").format("YYYY-MM-DD");

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [trxType, setTrxType] = useState("payment");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(100);
  const [currency, setCurrency] = useState("");
  const [sheetType, setSheetType] = useState(""); //purpose
  const [outputType, setOutputType] = useState("pdf");
  const { data, isLoading, refetch } = useGetTransactionByUserQuery({
    token: loggedInUserInfo?.access_token,
    skip,
    limit,
    fromDate,
    toDate,
    trxType,
    sheetType,
    currency:currency?.toLowerCase()
  });
  const [triggerDownloadTransactionSheet] =
    useLazyDownloadTransactionSheetQuery({
      token: loggedInUserInfo?.access_token,
      skip,
      limit,
      fromDate,
      toDate,
      trxType,
      sheetType,
      currency:currency?.toLowerCase()
    });

  useEffect(() => {
    refetch();
  }, [fromDate, toDate, trxType, skip, limit, sheetType,currency]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleDownload = async () => {
    const { data } = await triggerDownloadTransactionSheet({
      token: loggedInUserInfo?.access_token,
      skip,
      limit,
      fromDate,
      toDate,
      trxType,
      sheetType,
    });

    if (data?.success) {
      toast.dismiss();
      toast.success(data?.message);

      //download
      const fileUrl =
        outputType === "pdf"
          ? `${BASE_URL}${data?.pdfPath}`
          : `${BASE_URL}${data?.cvsPath}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = true;
      link.click();
    
    } else {
      toast.dismiss();
      toast.error(data?.msg);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header title="Transaction Sheet" />

      <div className="md:w-[800px] w-full mx-auto p-16">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-6">
          <h2 className="text-lg font-semibold">Filter by </h2>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <div className="flex gap-2 items-center">
              <label htmlFor="trx-type" className="text-sm font-medium">
                Currency
              </label>
              <select
                id="trx-type"
                className="flex cursor-pointer items-center justify-between gap-2 rounded-full bg-white p-2 px-4 text-sm font-semibold text-black shadow-md"
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
              >
                {all_currencies?.currencies?.map((c) => (
                  <option key={c._id} value={c?.name}>{c?.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <label htmlFor="from-date" className="text-sm font-medium">
                From
              </label>
              <input
                id="from-date"
                type="date"
                className="rounded-md border p-2 text-sm"
                value={fromDate}
                onChange={handleFromDateChange}
              />
            </div>

            <div className="flex gap-2 items-center">
              <label htmlFor="to-date" className="text-sm font-medium">
                To
              </label>
              <input
                id="to-date"
                type="date"
                className="rounded-md border p-2 text-sm"
                value={toDate}
                onChange={handleToDateChange}
              />
            </div>
          </div>
        </div>

        <div className="my-20">
          <label className="border-b-[1px] text-xl text-secondary border-primary">
            Sheet Type
          </label>
          <div className="my-10 flex flex-wrap gap-26 justify-start items-center">
            <div
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => setSheetType("Business Deal")}
            >
              <div
                className={`${
                  sheetType === "Business Deal" && "bg-primary text-white"
                }  w-[66px] h-[66px] p-4 rounded-md`}
              >
                <Handshake size={55} />
              </div>
              <p className="text-xs">{t("Business Deal")}</p>
            </div>
            <div
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => setSheetType("Investment")}
            >
              <div
                className={`${
                  sheetType === "Investment" && "bg-primary text-white"
                }  w-[66px] h-[66px] p-4 rounded-md`}
              >
                <ChartNoAxesColumnIncreasing size={55} />
              </div>
              <p className="text-xs">{t("Investment")}</p>
            </div>
            <div
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => setSheetType("ROI")}
            >
              <div
                className={`${
                  sheetType === "ROI" && "bg-primary text-white"
                }  w-[66px] h-[66px] p-4 rounded-md`}
              >
                <TrendingUp size={55} />
              </div>
              <p className="text-xs">{t("ROI")}</p>
            </div>
            <div
              className="flex flex-col justify-center items-center cursor-pointer"
              onClick={() => setSheetType("Regular")}
            >
              <div
                className={`${
                  sheetType === "Regular" && "bg-primary text-white"
                }  w-[66px] h-[66px] p-4 rounded-md`}
              >
                <ShoppingCart size={55} />
              </div>
              <p className="text-xs">{t("Regular")}</p>
            </div>
          </div>
        </div>

        {data?.transactions?.length < 1 ? (
          <p className="text-center text-gray-500">No transactions yet.</p>
        ) : (
          <>
            {data?.transactions?.map((trx) => (
              <div
                key={trx._id}
                className="flex justify-between items-start py-10 border-b-2"
              >
                <div className="flex gap-2 items-start justify-center">
                  <Image
                    src={BASE_URL + trx.logo}
                    width={100}
                    height={100}
                    alt="Logo"
                  />
                  <div className="-mt-1 text-sm">
                    <h5 className="font-semibold">
                      {trx.type === "mfs" ? "MFS" : "Bank"}
                    </h5>
                    <p>{trx.type === "mfs" ? trx.methode : trx.bankName}</p>

                    {trx.type === "mfs" ? (
                      <>
                        <p>Merchant: {trx.businessName}</p>
                        <p>Sender: {trx.merchantNumber}</p>
                        <p>TrxID: {trx.transactionId}</p>
                        <p>System TrxId: {trx.systemTransactionId}</p>
                      </>
                    ) : (
                      <>
                        <p>Account: {trx.accountName}</p>
                        <p>
                          {t("Account Number")}: {trx.accountNumber}
                        </p>
                        <p>Branch: {trx.branchName}</p>
                        <p>Routing: {trx.routingNumber}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-end font-thin text-sm">
                  {trx.transact === "received" ? (
                    <p className="text-primary font-semibold">
                      +{trx.amount} BDT
                    </p>
                  ) : (
                    <p className="text-red-500 font-semibold">
                      -{trx.amount} BDT
                    </p>
                  )}
                  <p>
                    {new Date(trx.createdAt).toLocaleTimeString()}{" "}
                    {new Date(trx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="flex flex-col gap-6 justify-center items-center">
          <div>
            <label htmlFor="">Output Type : </label>
            <select
              onChange={(e) => setOutputType(e.target.value)}
              className="cursor-pointer"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <button onClick={handleDownload} className="btn-primary mx-auto my-6">
            <Download /> Download
          </button>
        </div>
      </div>
    </>
  );
}
