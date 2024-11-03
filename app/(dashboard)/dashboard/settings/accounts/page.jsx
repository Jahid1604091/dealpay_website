"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import { useSearchParams } from "next/navigation";
import {
  useEditAccountMutation,
  useGetAccountsByUserQuery,
} from "@/app/(root)/redux/slices/accountApiSlice";
import { useSelector } from "react-redux";
import MfsAccounts from "../../components/bank-mfs/MfsAccounts";
import BankAccounts from "../../components/bank-mfs/BankAccounts";
import OthersAccounts from "../../components/bank-mfs/OthersAccounts";
import { isBangladeshiPhoneNumber } from "@/app/utils/helpers";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const Accounts = () => {
  const searchParams = useSearchParams();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { data: accounts } = useGetAccountsByUserQuery({
    userId: loggedInUserInfo?.user?._id,
    token: loggedInUserInfo?.access_token,
  });
  const [editAccount, { isLoading }] = useEditAccountMutation();
  const [accType, setAccType] = useState(searchParams?.get("renderFrom"));

  const handleEdit = async (editedAccount, callFrom) => {
    // e.preventDefault();
    let bodyData;
    if (callFrom == "mfs") {
      bodyData = { merchantNumber: editedAccount?.merchantNumber };
    } else if (callFrom == "bank") {
      bodyData = {
        bankName: editedAccount.bankName,
        accountNumber: editedAccount.accountNumber,
        branchName:editedAccount.branchName,
        routingNumber:editedAccount.routingNumber
      };
    }
    else if(callFrom === 'others'){
      bodyData = {
        payoneerEmail: editedAccount.payoneerEmail,
        payoneerId:editedAccount.payoneerId
      };
      
    }

    const formData = new FormData();
    formData.append("info", JSON.stringify(bodyData));
    formData.append("accountId", editedAccount?._id);

    const res = await editAccount({
      data: formData,
      token: loggedInUserInfo?.access_token,
    }).unwrap();

    if (res.success) {
      toast.dismiss();
      toast.success(res?.msg);
    } else {
      toast.dismiss();
      toast.error(res?.msg);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Header title="Account Details" />
      <div className="md:w-[800px] mx-auto p-16">
        <div className="my-10 flex items-center justify-start gap-10 text-xl md:justify-between">
          <div></div>
          <div className="flex items-center justify-between gap-2">
            <select
              className="flex cursor-pointer items-center justify-between gap-2 rounded-full bg-white p-2 px-4 text-sm font-semibold text-black shadow-md  md:text-lg"
              onChange={(e) => setAccType(e.target.value)}
              value={accType}
            >
              <option value="mfs">MFS Accounts</option>
              <option value="bank">Bank Accounts</option>
              <option value="others">Other Accounts</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full">
            {accType === "mfs" ? (
              <MfsAccounts
                accounts={accounts?.mfsAccounts}
                handleEdit={handleEdit}
              />
            ) : accType === "bank" ? (
              <BankAccounts
                accounts={accounts?.bankAccounts}
                handleEdit={handleEdit}
              />
            ) : (
              <OthersAccounts
                accounts={accounts?.othersAccounts}
                handleEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;
