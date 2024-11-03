import { DiffIcon, PlusIcon, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { useAddAccountMutation } from "@/app/(root)/redux/slices/accountApiSlice";
import { isBangladeshiPhoneNumber } from "@/app/utils/helpers";
import Loader from "../Loader";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const payment_methods = [
  {
    id: 1,
    name: "ssl",
  },
  {
    id: 2,
    name: "bKash",
  },
];

const Mfs = () => {
  const { t } = useTranslation();
  const [addAccount, { isLoading, isError, isSuccess }] =
    useAddAccountMutation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState(
    payment_methods[0]?.name || ""
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [appKey, setAppKey] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [sslStoreId, setSslStoreId] = useState("");
  const [sslPassword, setSslPassword] = useState("");
  const [merchantNumber, setMerchantNumber] = useState("");
  const [businessName, setBusinessName] = useState("DealPay Asia");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bodyData;
    if (paymentMethod === "ssl") {
      bodyData = {
        methode: paymentMethod,
        merchantNumber,
        businessName,
        ssl_store_id: sslStoreId,
        ssl_store_password: sslPassword,
      };
    } else if (paymentMethod === "bKash") {
      bodyData = {
        methode: "bkash",
        merchantNumber,
        businessName,
        bkash_app_key: appKey,
        bkash_app_secret: appSecret,
        bkash_username: username,
        bkash_password: password,
      };
    }
    if (isBangladeshiPhoneNumber(merchantNumber)) {
      const res = await addAccount({
        data: bodyData,
        type: "mfs",
        token: loggedInUserInfo?.access_token,
      }).unwrap();

      if (res.success) {
        toast.dismiss();
        toast.success(res?.msg);
      } else {
        toast.dismiss();
        toast.error(res?.msg);
      }
    } else {
      toast.dismiss();
      toast.warn("Please enter a valid mobile number");
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Link
        href={{ pathname: "/dashboard/settings/accounts", query: { renderFrom: "mfs" } }}
        className="w-[120px] mx-auto md:mx-0 bg-primary text-white shadow-md rounded-3xl p-1 px-6 flex gap-1 items-center justify-center text-sm mb-6"
      >
        {t("View All")}
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="grid xl:grid-cols-3 gap-30">
          <div className="flex flex-col">
            <label
              htmlFor=""
              className="border-b-[1px] text-xl text-secondary border-primary"
            >
              Payment Method Type
            </label>
            <select
              className="cursor-pointer"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {payment_methods?.map((method) => {
                return (
                  <option key={method.id} value={method.name}>
                    {method.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="border-b-[1px] text-xl text-secondary border-primary">
              {t("Merchant Number")}
            </label>
            <input
              type="number"
              className=" text-secoundary w-full"
              value={merchantNumber}
              onChange={(e) => setMerchantNumber(e.target.value)}
              placeholder="Enter merchant number..."
            />
          </div>
          <div className="flex flex-col">
            <label className="border-b-[1px] text-xl text-secondary border-primary">
              Business Name
            </label>
            <input
              type="text"
              className="text-secoundary w-full"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          {paymentMethod === "bKash" && (
            <>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    Username
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username..."
                  />
                </label>
              </div>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    Password
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                  />
                </label>
              </div>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    App Key
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={appKey}
                    onChange={(e) => setAppKey(e.target.value)}
                    placeholder="Enter app key..."
                  />
                </label>
              </div>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    App Secret
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                    placeholder="Enter app secret..."
                  />
                </label>
              </div>
            </>
          )}

          {paymentMethod === "ssl" && (
            <>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    SSL Store Id
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={sslStoreId}
                    onChange={(e) => setSslStoreId(e.target.value)}
                    placeholder="Enter ssl store id..."
                  />
                </label>
              </div>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    SSL Store Password
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={sslPassword}
                    onChange={(e) => setSslPassword(e.target.value)}
                    placeholder="Enter ssl store password..."
                  />
                </label>
              </div>
            </>
          )}
        </div>

        {/* <div className="flex flex-col justify-center items-center py-26 my-30">
          <button className="flex gap-2 items-center justify-center bg-secondary_dark text-white p-3 px-16 rounded-full">
            <DiffIcon /> Add More
          </button>
        </div> */}
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

export default Mfs;
