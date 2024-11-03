import { DiffIcon, PlusIcon, RefreshCcw } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { useAddAccountMutation } from "@/app/(root)/redux/slices/accountApiSlice";
import Loader from "../Loader";
import Link from "next/link";

const payment_methods = [
  {
    id: 1,
    name: "stripe",
  },
  {
    id: 2,
    name: "paypal",
  },
  {
    id: 3,
    name: "payoneer",
  },
  {
    id: 4,
    name: "razorpay",
  },
];

const types = [
  {
    id: 1,
    name: "business",
  },
  {
    id: 2,
    name: "personal",
  },
];

const Others = () => {
  const { t } = useTranslation();
  const [addAccount, { isLoading, isError, isSuccess }] =
    useAddAccountMutation();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState(
    payment_methods[0]?.name || ""
  );

  const [email, setEmail] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [id, setId] = useState("");
  const [businessName, setBusinessName] = useState("DealPay Asia");
  const [type, setType] = useState(types[0]?.name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bodyData;

    if (paymentMethod === "stripe") {
      bodyData = {
        methode: paymentMethod,
        stripeEmail: email,
        stripe_public_key: publicKey,
        stripe_secret_key: secretKey,
      };
    } else if (paymentMethod === "paypal") {
      bodyData = {
        methode: paymentMethod,
        paypalType: type,
        paypalId: id,
        paypalEmail: email,
        paypal_client_id: publicKey,
        paypal_client_secret: secretKey,
      };
    } else if (paymentMethod === "payoneer") {
      bodyData = {
        methode: paymentMethod,
        payoneerType: type,
        payoneerId: id,
        payoneerEmail: email,
      };
    } else if (paymentMethod === "razorpay") {
      bodyData = {
        methode: paymentMethod,
        payoneerType: type,
        razorpay_key_id: id,
        razorpay_key_secret: secretKey,
      };
    }

    const res = await addAccount({
      data: bodyData,
      type: "others",
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
      <Link
        href={{
          pathname: "/dashboard/settings/accounts",
          query: { renderFrom: "others" },
        }}
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
          <div className="flex flex-col ">
            <label htmlFor="" className="text-secondary">
              Account Type
            </label>
            <select
              className="cursor-pointer"
              onChange={(e) => setType(e.target.value)}
            >
              {types?.map((type) => {
                return (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="my-10">
            <label>
              <p className="border-b-[1px] text-xl text-secondary border-primary">
                Enter Email
              </p>
              <input
                type="email"
                className="mt-2 text-secoundary w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email..."
              />
            </label>
          </div>

          {paymentMethod === "stripe" ? (
            <>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    Public Key
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="Enter public key..."
                  />
                </label>
              </div>

              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    Secret Key
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key..."
                  />
                </label>
              </div>
            </>
          ) : paymentMethod === "paypal" ? (
            <>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    PayPal Client Id
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter paypal id..."
                  />
                </label>
              </div>

              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    Paypal Client Secret
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key..."
                  />
                </label>
              </div>
            </>
          ) : paymentMethod === "payoneer" ? (
            <div className="my-10">
              <label>
                <p className="border-b-[1px] text-xl text-secondary border-primary">
                  Client Id
                </p>
                <input
                  type="text"
                  className="mt-2 text-secoundary w-full"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter payoneer id..."
                />
              </label>
            </div>
          ) : paymentMethod === "razorpay" ? (
            <>
              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    Enter Id
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter  id..."
                  />
                </label>
              </div>

              <div className="my-10">
                <label>
                  <p className="border-b-[1px] text-xl text-secondary border-primary">
                    Secret Key
                  </p>
                  <input
                    type="text"
                    className="mt-2 text-secoundary w-full"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key..."
                  />
                </label>
              </div>
            </>
          ) : (
            ""
          )}
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

export default Others;
