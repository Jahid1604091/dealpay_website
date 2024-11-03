import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { useAddAccountMutation } from "@/app/(root)/redux/slices/accountApiSlice";
import { DiffIcon, PlusIcon, RefreshCcw } from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useGetAllCountriesQuery } from "@/app/(root)/redux/slices/authApiSlice";
import Loader from "../Loader";
import Link from "next/link";

const banks = [
  {
    id: 1,
    name: "Bank Asia",
  },
  {
    id: 2,
    name: "Dutch Bangla",
  },
  {
    id: 3,
    name: "Islami bank",
  },
];

const Bank = () => {
  const { t } = useTranslation();
  const [addAccount, { isLoading, isError, isSuccess }] =
    useAddAccountMutation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const { data: countries } = useGetAllCountriesQuery();

  const bankLogoRef = useRef(null);
  const [bankLogo, setBankLogo] = useState();
  const [bankName, setBankName] = useState(banks[0]?.name || "");
  const [accountName, setAccountName] = useState("DealPay Asia");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [country, setCountry] = useState(null);

  const handleBankLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setBankLogo({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const information = {
      bankName,
      accountName,
      accountNumber,
      branchName,
      routingNumber,
      country,
      swiftCode,
    };

    if (information && bankLogo?.file) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(information));
      formData.append("logo", bankLogo.file);

      const res = await addAccount({
        data: formData,
        type: "bank",
        token: loggedInUserInfo?.access_token,
      });

      if (res.success) {
        toast.dismiss();
        toast.success(res?.msg);
      } else {
        toast.dismiss();
        toast.error(res?.data.msg);
      }
    } else {
      toast.dismiss();
      toast.warn("Please enter all required field");
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Link
        href={{
          pathname: "/dashboard/settings/accounts",
          query: { renderFrom: "bank" },
        }}
        className="w-[120px] mx-auto md:mx-0 bg-primary text-white shadow-md rounded-3xl p-1 px-6 flex gap-1 items-center justify-center text-sm mb-6"
      >
        {t("View All")}
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="grid xl:grid-cols-3 gap-30">
          <div className="flex flex-col">
            <label htmlFor="" className="text-secondary">
              Bank Logo
            </label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleBankLogoChange}
              ref={bankLogoRef}
            />

            <div
              className="border-[.5px] border-primary rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
              style={{
                backgroundImage: `url(${bankLogo?.imageUrl})`,
              }}
            >
              <div className=" my-2 p-2 rounded-2xl border-[.5px] border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => bankLogoRef.current.click()}
                >
                  <p className="text-sm text-black">{`${
                    bankLogo ? "Change" : "Upload"
                  } Bank Logo`}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col ">
            <label
              htmlFor=""
              className="border-b-[1px] text-xl text-secondary border-primary"
            >
              {t("Bank Name")}
            </label>
            <input
                type="text"
                className="mt-2 text-secoundary w-full"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter Bank Name..."
              />
          </div>

          <div className="flex flex-col">
            <label>
              <p className="border-b-[1px] text-xl text-secondary border-primary">
                {t("Account Name")}
              </p>
              <input
                type="text"
                className="mt-2 text-secoundary w-full"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter acountName..."
              />
            </label>
          </div>
          <div className="my-10">
            <label>
              <p className="border-b-[1px] text-xl text-secondary border-primary">
                {t("Account Number")}
              </p>
              <input
                type="text"
                className="mt-2 text-secoundary w-full"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number..."
              />
            </label>
          </div>
          <div className="my-10">
            <label>
              <p className="border-b-[1px] text-xl text-secondary border-primary">
                {t("Branch Name")}
              </p>
              <input
                type="text"
                className="mt-2 text-secoundary w-full"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Enter branch name..."
              />
            </label>
          </div>
          <div className="my-10">
            <label>
              <p className="border-b-[1px] text-xl text-secondary border-primary">
                Swift Code
              </p>
              <input
                type="text"
                className="mt-2 text-secoundary w-full"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                placeholder="Enter swift code..."
              />
            </label>
          </div>
          <div className="my-10">
            <label>
              <p className="border-b-[1px] text-xl text-secondary border-primary">
                {t("Routing Number")}
              </p>
              <input
                type="text"
                className="mt-2 text-secoundary w-full"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="Enter routing number..."
              />
            </label>
          </div>

          <div className="flex flex-col ">
            <label
              htmlFor=""
              className="border-b-[1px] text-xl text-secondary border-primary"
            >
              Country Name
            </label>
            <select
              className="cursor-pointer"
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">{t("Select country")}</option>
              {countries?.countries?.map((country) => {
                return (
                  <option key={country._id} value={country._id}>
                    {country.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

       
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center mt-10">
          <button type="submit" className="btn-primary">
            <PlusIcon />
            {t("Add Now")}
          </button>
          <SecondaryButton
            text={t(`Can't submit`)}
            button_text={t("Talk with team")}
            link={"/support"}
          />
        </div>
      </form>
    </>
  );
};

export default Bank;
