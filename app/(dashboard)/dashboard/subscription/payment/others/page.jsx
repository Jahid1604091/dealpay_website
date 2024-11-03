"use client";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import queryString from "query-string";
import { useEffect, useState } from "react";
import useRazorpay from "react-razorpay";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { BASE_URL, DOMAIN_URL } from "@/app/utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faMobile } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { MoveLeft } from "lucide-react";
import { useGetAllAccountsQuery } from "@/app/(root)/redux/slices/authApiSlice";
import Header from "../../../components/Header";
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { usePayMutation } from "@/app/(root)/redux/slices/accountApiSlice";

const Live_Payments = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: accounts, isLoading, isError } = useGetAllAccountsQuery();
  const { loggedInUserInfo, renewSubscriptionInfo } = useSelector(
    (state) => state.auth
  );
  const [pay] = usePayMutation();

  //   const [subscriptionViaMfs] = useSubscriptionViaMfsMutation();
  const [Razorpay] = useRazorpay();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState("");
  const [message, setMessage] = useState("");
  const [trxId, setTrxId] = useState("");

  function Message({ content }) {
    return <p className="text-green-500 font-semibold">{content}</p>;
  }

  useEffect(() => {
    if (accounts?.othersAccounts && accounts.othersAccounts.length > 0) {
      setSelectedAccount(accounts.othersAccounts[0]);
    }
  }, [accounts]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSslUrl("");
    setBkashUrl("");
    setModalUrl("");
  };

  const [stripePayable, setStripePayable] = useState([false, ""]);
  const publicKey =
    selectedAccount?.methode === "stripe" && selectedAccount?.stripe_public_key;
  const stripePromise = loadStripe(publicKey);
  const [stripeOptions, setStripeOptions] = useState({
    clientSecret: stripePayable[1],
    theme: "night",
    labels: "floating",
  });

  const stripePaymentData = {
    accountId: selectedAccount?._id,
    currencyId:
      renewSubscriptionInfo?.currentSubscription?.currencyId ||
      loggedInUserInfo?.user?.currency,
    subscriptionId: renewSubscriptionInfo?.currentSubscription?._id,
    amount: renewSubscriptionInfo?.currentSubscription?.price,
    coupon: renewSubscriptionInfo?.coupon,
    reference: renewSubscriptionInfo?.reference,
    purpose: "subscription_renewal",
    callbackUrl: DOMAIN_URL + "/dashboard/subscription",
  };

  const handlePaymentStripeInt = async () => {
    try {
      setIsStripeModalOpen(true);
      const { data } = await axios.post(
        BASE_URL + "/pay/stripe/app/subs/renew",
        stripePaymentData,
        {
          headers: {
            // "user-id": stripePaymentData["user-id"],
            // "receiver-id": stripePaymentData["receiver-id"],
            // "pay-token": stripePaymentData["pay-token"],
            token: loggedInUserInfo?.access_token || stripePaymentData["token"],
          },
        }
      );

      if (data.success) {
        // const testUrl = "https://api.stripe.com/v1/elements/sessions";
        // const testPublicKey = publicKey;
        // const params = {
        //   key: testPublicKey,
        //   type: "payment_intent",
        //   locale: "en-US",
        //   client_secret: data?.clientSecret,
        // };
        // try {
        //   const response = await axios.get(testUrl, { params });
        //   if (response.status === 401) {
        //     throw new Error("Invalid Stripe public key.");
        //   } else if (!response.status === 200) {
        //     throw new Error(`Error: ${response.statusText}`);
        //   }
        // } catch (error) {
        //   console.log(error);
        //   throw new Error("Invalid Stripe public key.");
        // }
        setStripePayable([true, data?.clientSecret]);
        // setIsStripeModalOpen(true);
        // setIsModalOpen(true);

        typeof window !== "undefined" && window.open(data?.url);
      } else {
        setStripePayable([false, ""]);
        setIsStripeModalOpen(false);
        toast.error(data.msg || "Server Error");
      }
    } catch (error) {
      console.log(error);
      setIsStripeModalOpen(false);
      setStripePayable([false, ""]);
      toast.error(
        error?.response?.data?.msg || error?.message || "Server Error"
      );
    }
  };

  const payPalOptions = {
    "client-id":
      "AR_kFBnIhwv3ru5s5TvWV1r4FZ-ko3n9lqzcAi1lW52TwYDOzjTe1phArVQ7NMw6JSjGJZm5QrLRKuH6", // You will get it from Backend Response accounts
    currency: "USD", // By Default USD, If others, Uncomment and enter the currency
    "enable-funding": "paylater,venmo",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const paypalPayData = {
    accountId: selectedAccount?._id,
    currencyId:
      renewSubscriptionInfo?.currentSubscription?.currencyId ||
      loggedInUserInfo?.user?.currency,
    subscriptionId: renewSubscriptionInfo?.currentSubscription?._id,
    amount: renewSubscriptionInfo?.currentSubscription?.price,
    coupon: renewSubscriptionInfo?.coupon,
    reference: renewSubscriptionInfo?.reference,
    purpose: "subscription_renewal",
    callbackUrl: DOMAIN_URL + "/dashboard/subscription",
  };
  const paypalPayHeader = {
    // "user-id": loggedInUserInfo?.user?._id,
    // "receiver-id": paymentInfo?.receiverId,
    // "pay-token": loggedInUserInfo?.payToken,
    token: loggedInUserInfo?.access_token,
  };

  const handlePaymentPaypal1 = async () => {
    try {
      const { data: orderData } = await axios.post(
        BASE_URL + "/pay/paypal/app/subs/renew",
        paypalPayData,
        {
          headers: paypalPayHeader,
        }
      );
      if (orderData.id) {
        return orderData.id;
      } else {
        if (orderData.success == false) throw new Error(orderData.msg);
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || error?.msg || error?.message;
      toast.error(errorMsg);
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout---${errorMsg}`);
    }
  };

  const handlePaymentPaypal2 = async (data, actions) => {
    try {
      const { data: orderData } = await axios.post(
        BASE_URL + `/pay/paypal/exe?state=approve`,
        { orderId: data.orderID, ...paypalPayData },
        { headers: paypalPayHeader }
      );

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        console.log("Success");
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        const transaction = orderData.purchase_units[0].payments.captures[0];
        setMessage(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        );
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
      }
    } catch (error) {
      console.log(error);
      setMessage(
        `Sorry, your transaction could not be processed2...${
          error?.response?.data?.msg || error?.message || error
        }`
      );
    }
  };

  const handlePaymentPaypal3 = async (data) => {
    try {
      await axios.post(
        BASE_URL + `/pay/paypal/exe?state=cancel`,
        {
          orderId: data?.orderID,
          ...paypalPayData,
        },
        { headers: paypalPayHeader }
      );
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  const razorpayPaydata = {
    accountId: selectedAccount?._id,
    currencyId:
      renewSubscriptionInfo?.currentSubscription?.currencyId ||
      loggedInUserInfo?.user?.currency,
    amount: renewSubscriptionInfo?.currentSubscription?.price,
    subscriptionId: renewSubscriptionInfo?.currentSubscription?._id,
    coupon: renewSubscriptionInfo?.coupon,
    reference: renewSubscriptionInfo?.reference,
    purpose: "subscription_renewal",
    callbackUrl: DOMAIN_URL + "/dashboard/subscription",
  };
  const razorpayPayHeader = {
    token: loggedInUserInfo?.access_token,
  };

  const handlePaymentRazorpay = async () => {
    try {
      const { data } = await axios.post(
        BASE_URL + "/pay/razorpay/subs/renew",
        razorpayPaydata,
        { headers: razorpayPayHeader }
      );
      const rzp1 = new Razorpay({
        key: data?.key_id,
        amount: renewSubscriptionInfo?.currentSubscription?.price,
        currency: "INR",
        name: "Payment",
        image:
          "https://cdn.glitch.global/ee4f756c-94ff-4c94-8c73-d10b1da28972/3ce7b269-0b55-4775-9ad3-3f65777f94b5.jpg?v=1724485172558",
        order_id: data?.orderId,
        handler: async (response) => {
          //   console.log(response); //ok
          toast.success("Payment is processing......Please Wait");
          try {
            const res = await axios.post(
              BASE_URL + "/pay/razorpay/exe/subs/renew",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: data.amount,
                accountId: data.accountId,
                currencyId: data.currencyId,
                userId: data.userId,
                receiverId: data.receiverId,
                subscriptionId: renewSubscriptionInfo?.currentSubscription?._id,
                currency:
                  renewSubscriptionInfo?.currentSubscription?.currencyName,
                coupon: renewSubscriptionInfo?.coupon || "No Coupon",
                reference: renewSubscriptionInfo?.reference || "No ref",
                purpose: "subscription_renewal",
              },
              { headers: razorpayPayHeader }
            );
            console.log(res?.data);
            if (res?.data?.success) {
              toast.success(
                `Payment Successful, System Transaction ID: ${res?.data?.systemTransactionId} and Razorpay Payment ID: ${res?.data?.transactionId}`
              );
              router.push("/dashboard/subscription/success");
            } else {
              toast.error(
                "Server Error, Payment completed but we didn,t received any data"
              );
            }
          } catch (error) {
            console.log(error);
            toast.error(
              "Server Error, Payment completed but we didn,t received any data"
            );
          }
        },
      });
      rzp1.on("payment.failed", function (response) {
        toast.error(response.error.code);
        toast.error(response.error.description);
        toast.error(response.error.source);
        toast.error(response.error.step);
        toast.error(response.error.reason);
        toast.error(response.error.metadata.order_id);
        toast.error(response.error.metadata.payment_id);
        console.log("Razorpay Payment Failed", response);
      });

      rzp1.open();
    } catch (error) {
      console.log(error);
      const errorMsg =
        error?.response?.data?.msg || error?.message || "Frontend Error";
      toast.error(errorMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const information = {
      accountId: selectedAccount?._id,
      paymentType: renewSubscriptionInfo?.paymentType,
      //@not sure about currency whose?
      currencyId: loggedInUserInfo?.user.currency,
      transactionId: trxId,
      amount: renewSubscriptionInfo?.currentSubscription?.price,
      coupon: renewSubscriptionInfo?.coupon,
      reference: renewSubscriptionInfo?.reference,
      purpose: renewSubscriptionInfo?.purpose,
    };

    formData.append("info", JSON.stringify(information));

    const res = await pay({
      data: formData,
      userId: loggedInUserInfo?.user._id,
      receiverId: renewSubscriptionInfo?.receiverId,
      payToken: loggedInUserInfo?.payToken,
      token: loggedInUserInfo?.access_token,
    }).unwrap();

    if (res.success) {
      dispatch(
        setPaymentInfo({
          ...renewSubscriptionInfo,
          accNumber: selectedAccount?.merchantNumber,
          isLive: false,
          trxId,
        })
      );
      toast.dismiss();
      toast.success(res.msg);
      router.push("/dashboard/subscription/success");
    } else {
      toast.dismiss();
      toast.error(res.msg);
    }
  };
  return (
    <>
      <Header title={t("Make Payment")} />
      <section className="max-w-[480px] my-30 mx-auto px-16">
        <div className="border rounded-xl p-2 border-primary w-[80px] h-[80px] text-xs uppercase font-semibold flex flex-col justify-center items-center mx-auto">
          <FontAwesomeIcon icon={faMobile} className="text-2xl" />
          Others
        </div>

        <div className="flex items-center justify-center gap-16 my-20">
          {isLoading ? (
            <div className="my-6 px-4">Fetching Others Accounts...</div>
          ) : accounts?.othersAccounts?.length ? (
            accounts.othersAccounts.map((acc) => (
              <div
                key={acc._id}
                className={`cursor-pointer ${
                  selectedAccount === acc ? "opacity-100" : "opacity-15"
                }`}
                onClick={() => setSelectedAccount(acc)}
              >
                <Image
                  src={acc.logo}
                  width={68}
                  height={68}
                  priority
                  alt={acc.methode}
                />
              </div>
            ))
          ) : (
            <div className="my-6 px-4">No accounts available.</div>
          )}
        </div>
        {accounts?.othersAccounts?.length > 0 && (
          <>
            <IFrameModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              modalUrl={modalUrl}
            />
            <StripeModal
              isOpen={isStripeModalOpen}
              onClose={() => setIsStripeModalOpen(false)}
              stripePayable={stripePayable}
              stripePromise={stripePromise}
              stripeOptions={stripeOptions}
              stripePaymentData={stripePaymentData}
            />
            <div className="flex items-center justify-center gap-3 py-20">
              <div className="min-w-[200px] h-min p-0 m-0">
                {selectedAccount?.methode === "stripe" ? (
                  <button
                    onClick={handlePaymentStripeInt}
                    className="bg-[url('https://i.ibb.co/N9pWTGw/stripe.png')] hover:scale-105 active:scale-90 duration-300 bg-no-repeat bg-center bg-[length:40%_65%] w-full h-[34px] border-blue-600 border rounded-full"
                  ></button>
                ) : selectedAccount?.methode === "paypal" ? (
                  <PayPalScriptProvider options={payPalOptions}>
                    <PayPalButtons
                      className="hover:scale-105 active:scale-90 duration-300"
                      style={{
                        shape: "pill",
                        layout: "vertical",
                      }}
                      fundingSource="paypal"
                      createOrder={handlePaymentPaypal1}
                      onApprove={handlePaymentPaypal2}
                      onCancel={handlePaymentPaypal3}
                    />
                  </PayPalScriptProvider>
                ) : selectedAccount?.methode === "razorpay" ? (
                  <button
                    onClick={handlePaymentRazorpay}
                    className="bg-[url('https://i.ibb.co/MPh8rhy/razorpay.png')] hover:scale-105 active:scale-90 duration-300 bg-no-repeat bg-center bg-[length:50%_65%] w-full h-[34px] border-blue-600 border rounded-full"
                  ></button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        )}
        {selectedAccount?.methode !== "razorpay" && (
          <form onSubmit={handleSubmit}>
            <div className="bg-primary p-10 md:px-30 rounded-2xl">
              <ul>
                <li className="text-white flex justify-between items-center my-6">
                  {t("Total Amount")}:
                  <input
                    type="number"
                    disabled
                    value={renewSubscriptionInfo?.currentSubscription?.price}
                    className="text-center bg-white text-black rounded-full p-1 w-[160px]"
                  />
                </li>
                <li className="text-white flex flex-col justify-between items-center my-6">
                  {t("Transaction ID")}
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="md:px-30 text-center bg-white text-black rounded-full p-1"
                  />
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-center justify-between mt-80">
              <SecondaryButton
                text={t(`Can't submit`)}
                button_text={t("Talk with team")}
                link="/support"
              />
              <button type="submit" className="btn-primary">
                <FontAwesomeIcon icon={faArrowRight} />
                {t("Pay Now")}
              </button>
            </div>
          </form>
        )}
        <Message content={message} />
      </section>
    </>
  );
};

export default Live_Payments;

const StripeCheckout = ({ stripePaymentData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const handlePaymentStripe = async (e) => {
    e.preventDefault();
    try {
      if (!stripe || !elements) {
        return;
      }
      const query = queryString.stringify(stripePaymentData);
      const returnUrl = BASE_URL + `/pay/stripe/exe?${query}`;
      toast.success("Payment succeeded!");
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        // redirect: "",
      });

      if (error) {
        console.error(error);
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        console.log("PaymentIntent:", paymentIntent);
      } else {
        console.log("PaymentIntent status:", paymentIntent.status);
      }
    } catch (error) {
      console.log(error);
      toast.error("Wrong Credentials");
    }
  };
  return (
    <form onSubmit={handlePaymentStripe}>
      <PaymentElement />
      <button
        type="submit"
        className="bg-sky-500 text-white px-12 block py-1 rounded-full duration-300 active:scale-90 hover:scale-105 font-medium mt-5 mx-auto"
      >
        Pay
      </button>
    </form>
  );
};

const StripeModal = ({
  isOpen,
  onClose,
  stripePayable,
  stripeOptions,
  stripePromise,
  stripePaymentData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[500] bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Live Payment</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          {stripePayable[0] && (
            <div className="p-10">
              <Elements stripe={stripePromise} options={stripeOptions}>
                <StripeCheckout stripePaymentData={stripePaymentData} />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IFrameModal = ({ isOpen, onClose, modalUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Live Payment</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <iframe
            src={modalUrl}
            title="bKash Payment"
            className="w-full h-96"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
