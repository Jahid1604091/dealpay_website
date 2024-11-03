"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useGetUserWiseTransactionQuery } from "@/app/(root)/redux/slices/transactionApiSlice";
import Header from "../components/Header";
import Loader from "../components/Loader";

export default function Transactions() {
  const router = useRouter();
  const {t} = useTranslation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { data, isLoading, isFetching } = useGetUserWiseTransactionQuery(
    loggedInUserInfo?.access_token
  );
  // const mergedData = data?.sent.concat(data?.received);

  return (
    <div>
      <Header title="Transactions" />
      <div className="md:max-w-[800px] mx-auto p-16">
        {isLoading || isFetching ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <button
                onClick={() => window.location.reload()}
                className="shadow-md rounded-3xl p-1 flex gap-1 items-center justify-center text-sm"
              >
                <RotateCcw size={14} /> {t('Refresh')}
              </button>

              <button className="shadow-md rounded-3xl p-1 flex gap-1 items-center justify-center text-sm">
              {t('View All')}
              </button>
            </div>

            {!data?.transactions?.length && !data?.sent?.length ? (
              <p className="text-center text-gray-500">No transactions yet.</p>
            ) : (
              <>
                {data?.transactions?.map((trx) => (
                  <div
                    key={trx._id}
                    className="flex justify-between items-start py-10 border-b-2"
                  >
                    <div className="flex gap-2 items-start justify-center">
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
                            <p>{t('Account Number')}: {trx.accountNumber}</p>
                            <p>Branch: {trx.branchName}</p>
                            <p>Routing: {trx.routingNumber}</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-end font-thin text-sm">
                      <p className="text-primary font-semibold">
                        +{trx.amount} BDT
                      </p>
                      <p>
                        {new Date(trx.createdAt).toLocaleTimeString()}{" "}
                        {new Date(trx.createdAt).toLocaleDateString()}
                      </p>
                    
                    </div>
                  </div>
                ))}

                {data.sent?.map((trx) => (
                  <div
                    key={trx._id}
                    className="flex justify-between items-start py-10 border-b-2"
                  >
                    <div className="flex gap-2 items-start justify-center">
                      <div className="-mt-1 text-sm">
                        <h5 className="font-semibold">
                          {trx.type === "mfs" ? "MFS" : "Bank"}
                        </h5>
                        <p>{trx.type === "mfs" ? trx.methode : trx.bankName}</p>

                        {trx.type === "mfs" ? (
                          <>
                            <p>Merchant: {trx.businessName}</p>
                            <p>Sender: {trx.merchantNumber}</p>
                            <p>{t('Enter trxID')}: {trx.transactionId}</p>
                          </>
                        ) : (
                          <>
                            <p>Account: {trx.accountName}</p>
                            <p>{t('Account Number')}: {trx.accountNumber}</p>
                            <p>Branch: {trx.branchName}</p>
                            <p>Routing: {trx.routingNumber}</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-end font-thin text-sm">
                      <p className="text-red-500 font-semibold">
                        -{trx.amount} BDT
                      </p>
                      <p>
                        {new Date(trx.createdAt).toLocaleTimeString()}{" "}
                        {new Date(trx.createdAt).toLocaleDateString()}
                      </p>
                      
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
