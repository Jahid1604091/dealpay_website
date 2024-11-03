"use client";
import { RotateCcw, TicketPercent, Vault } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import {
  useGetUserWiseTransactionQuery,
  useTransactionApprovalMutation,
} from "@/app/(root)/redux/slices/transactionApiSlice";
import { BASE_URL } from "@/app/utils/constants";

import Header from "../components/Header";
import Loader from "../components/Loader";


export default function Notifications() {
  const {t} = useTranslation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { data, isLoading, isFetching } = useGetUserWiseTransactionQuery(
    loggedInUserInfo?.access_token
  );
  const [transactionApproval] = useTransactionApprovalMutation();
  const [visibleBankSlip, setVisibleBankSlip] = useState(null);

  const handleShowBankSlip = (id) => {
    setVisibleBankSlip(id);
  };

  const handleCloseBankSlip = () => {
    setVisibleBankSlip(null);
  };

  const isBankSlipVisible = (id) => visibleBankSlip === id;

  const handleTransactionApproval = async (status, id) => {
    try {
      const res = await transactionApproval({
        status,
        id,
        token: loggedInUserInfo?.access_token,
      }).unwrap();
      if (res.success) {
        toast.dismiss();
        toast.success(res.msg);
      } else {
        toast.dismiss();
        toast.error(res.msg);
      }
    } catch (error) {
      console.log(`Error in Approval transaction ${error}`);
    }
  };

  return (
    <div className="">
      <Header title={t('Notification')} />

      {/* Pending approval */}
      <div className="md:max-w-[800px] mx-auto px-16">
        {isLoading || isFetching ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-between items-start my-10">
              <h4 className="border-b-2 w-[300px] font-semibold my-6">
                {t('Pending for Approval')}
              </h4>
              <div>
                <button
                  onClick={() => window.location.reload()}
                  className="shadow-md rounded-3xl p-1 flex gap-1 items-center justify-center text-sm"
                >
                  <RotateCcw size={14} /> {t('Refresh')}
                </button>
              </div>
            </div>

            {/* Check if there are any transactions */}
            {data?.transactions?.filter(tr=>tr.transact === 'received')?.length > 0 ? (
              data.transactions.filter(tr=>tr.transact === 'received').map((trx) => {
                return (
                  <div
                    key={trx._id}
                    className="flex justify-between items-start py-10 border-b-2"
                  >
                    <div className="flex gap-2 items-start justify-center">
                      {/* Image and Main Title */}
                      <div className="-mt-1 text-sm">
                        <h5 className="font-semibold">
                          {trx.type === "mfs" ? "MFS" : "Bank"}
                        </h5>
                        <p>{trx.type === "mfs" ? trx.methode : trx.bankName}</p>

                        {/* Conditional Information based on Type */}
                        {trx.type === "mfs" ? (
                          <>
                            <p>Merchant: {trx.businessName}</p>
                            <p>Sender: {trx.merchantNumber}</p>
                            <p>{t('Enter trxID')}: {trx.transactionId}</p>
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

                        <div className="flex gap-1 items-center justify-start">
                          {!trx.isReviewed && !trx.isVerified && (
                            <>
                              <button
                                onClick={() =>
                                  handleTransactionApproval("reject", trx._id)
                                }
                                className="bg-red-500 text-white rounded-3xl px-3"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() =>
                                  handleTransactionApproval("accept", trx._id)
                                }
                                className="bg-primary text-white rounded-3xl px-3"
                              >
                                Accept
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transaction Amount and Date */}
                    <div className="text-end font-thin text-sm">
                      <p className="text-primary font-semibold">
                        +{trx.amount} BDT
                      </p>
                      <p>
                        {new Date(trx.createdAt).toLocaleTimeString()}{" "}
                        {new Date(trx.createdAt).toLocaleDateString()}
                      </p>
                      {trx.type === "bank" && (
                        <button
                          onClick={() => handleShowBankSlip(trx._id)}
                          className="flex justify-center items-center font-normal mt-10 text-secondary"
                        >
                          <Vault size={18} /> Show Bank Slip
                        </button>
                      )}
                    </div>
                    {/* Bank Slip Modal */}
                    {isBankSlipVisible(trx._id) && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded shadow-lg">
                          <img
                            src={BASE_URL + trx.bankSlip}
                            alt="Bank Slip"
                            className="max-w-full h-auto"
                          />
                          <button
                            onClick={handleCloseBankSlip}
                            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // No transactions found
              <div className="text-center py-10">
                <p className="text-gray-500">No transaction received yet</p>
              </div>
            )}
            {data?.received?.length > 0 && (
              <button className="btn-primary mt-20 mx-auto">
                <FontAwesomeIcon icon={faArrowRight} className="" /> view all
              </button>
            )}
          </>
        )}
      </div>

      {/* New Offer */}
      <div className="md:max-w-[800px] mx-auto p-16">
        <div className="flex justify-between px-20 items-center">
          <h4 className="border-b-2 w-[200px] font-semibold my-6">{t('New Offer')}</h4>
          <div>
            <button className="shadow-md rounded-3xl p-1 flex gap-1 items-center justify-center text-sm">
             {t('View All')}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 place-items-center">
          <div>
            <Image
              src="/images/offer1.png"
              height={100}
              width={100}
              alt="offer"
              prio
              className="w-full h-auto max-w-[320px] p-2"
            />
            <div className="flex items-center justify-between">
              <div className="leading-3">
                <h6 className="text-sm font-semibold">15% Off</h6>
                <small className="text-xs font-thin">Zovo Team Ltd.</small>
              </div>
              <div className="bg-primary rounded-3xl px-3 flex items-center justify-center">
                <p className="text-sm text-white  flex gap-1 items-center justify-center">
                  <TicketPercent size={16} /> Coupon : zovo20
                </p>
              </div>
              <button className="font-thin text-sm">view</button>
            </div>
          </div>
          <div>
            <Image
              src="/images/offer1.png"
              height={100}
              width={100}
              alt="offer"
              prio
              className="w-full h-auto max-w-[320px] p-2"
            />
            <div className="flex items-center justify-between">
              <div className="leading-3">
                <h6 className="text-sm font-semibold">15% Off</h6>
                <small className="text-xs font-thin">Zovo Team Ltd.</small>
              </div>
              <div className="bg-primary rounded-3xl px-3 flex items-center justify-center">
                <p className="text-sm text-white  flex gap-1 items-center justify-center">
                  <TicketPercent size={16} /> Coupon : zovo20
                </p>
              </div>
              <button className="font-thin text-sm">view</button>
            </div>
          </div>
          <div>
            <Image
              src="/images/offer1.png"
              height={100}
              width={100}
              alt="offer"
              prio
              className="w-full h-auto max-w-[320px] p-2"
            />
            <div className="flex items-center justify-between">
              <div className="leading-3">
                <h6 className="text-sm font-semibold">15% Off</h6>
                <small className="text-xs font-thin">Zovo Team Ltd.</small>
              </div>
              <div className="bg-primary rounded-3xl px-3 flex items-center justify-center">
                <p className="text-sm text-white  flex gap-1 items-center justify-center">
                  <TicketPercent size={16} /> Coupon : zovo20
                </p>
              </div>
              <button className="font-thin text-sm">view</button>
            </div>
          </div>
          <div>
            <Image
              src="/images/offer1.png"
              height={100}
              width={100}
              alt="offer"
              prio
              className="w-full h-auto max-w-[320px] p-2"
            />
            <div className="flex items-center justify-between">
              <div className="leading-3">
                <h6 className="text-sm font-semibold">15% Off</h6>
                <small className="text-xs font-thin">Zovo Team Ltd.</small>
              </div>
              <div className="bg-primary rounded-3xl px-3 flex items-center justify-center">
                <p className="text-sm text-white  flex gap-1 items-center justify-center">
                  <TicketPercent size={16} /> Coupon : zovo20
                </p>
              </div>
              <button className="font-thin text-sm">view</button>
            </div>
          </div>

 
        </div>
      </div>
    </div>
  );
}
