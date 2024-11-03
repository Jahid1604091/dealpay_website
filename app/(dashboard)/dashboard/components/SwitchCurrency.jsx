"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  useGetAllCurrenciesQuery,
  useLazySwapCurrencyQuery,
} from "@/app/(root)/redux/slices/authApiSlice";
import { setTempLogout } from "@/app/(root)/redux/slices/authSlice";

export default function SwitchCurrency() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loggedInUserInfo } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetAllCurrenciesQuery(
    loggedInUserInfo?.access_token,
    {
      skip: !loggedInUserInfo?.access_token,
    }
  );
  const [triggerSwapCurrency] = useLazySwapCurrencyQuery();

  const filteredCurrencies =
    data?.currencies?.filter((c) =>
      [
        loggedInUserInfo?.user?.currency,
        loggedInUserInfo?.user?.currency2,
      ].includes(c._id)
    ) || [];

  // Sort currencies with the preferred one first
  const usersCurrencies = filteredCurrencies.sort((a, b) => {
    const preferredCurrency = loggedInUserInfo?.user?.currency;
    if (a._id === preferredCurrency) return -1;
    if (b._id === preferredCurrency) return 1;
    return 0;
  });

  const [currency, setCurrency] = useState(null);

  // Set the first currency on initial load if there are currencies available
  useEffect(() => {
    if (usersCurrencies.length > 0 && !currency) {
      setCurrency(usersCurrencies[0]);
    }
  }, [usersCurrencies]);

  // Handle switching between the two currencies
  const handleCurrencySwitch = async () => {
    if (usersCurrencies.length === 2) {
      const newCurrency = currency?._id === usersCurrencies[0]._id
        ? usersCurrencies[1]
        : usersCurrencies[0];
        
      setCurrency(newCurrency);

      const res = await triggerSwapCurrency(
        loggedInUserInfo?.access_token
      ).unwrap();
      if (res.success) {
        toast.dismiss();
        toast.success(res.msg);
        dispatch(setTempLogout());
        router.push("/auth/login");
      } else {
        toast.dismiss();
        toast.error(res.msg);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading currencies</div>;

  return (
    <div className="flex gap-6 items-center justify-center">
      <div className="font-bold text-slate-400 text-center">
        {currency?.name}
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className={`relative inline-block w-30 h-16 rounded-full transition-colors duration-300 ${
            currency?._id === usersCurrencies[0]?._id
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
          onClick={handleCurrencySwitch}
        >
          <span
            className={`absolute top-0 left-0 w-16 h-16 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              currency?._id === usersCurrencies[0]?._id
                ? "translate-x-[16px]"
                : ""
            }`}
          ></span>
        </div>
      </label>
    </div>
  );
}
