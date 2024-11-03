"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Mail, MessageSquareText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/app/(root)/redux/slices/authSlice";
import { useUpdateUserInfoMutation } from "@/app/(root)/redux/slices/authApiSlice";
import { toast } from "react-toastify";

export default function Alerts() {
  const dispatch = useDispatch();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const [updateUserInfo] = useUpdateUserInfoMutation();

  // Initialize the state from loggedInUserInfo
  const [alertType, setAlertType] = useState({
    sendSms: loggedInUserInfo?.user?.sendSMS || false,
    sendEmail: loggedInUserInfo?.user?.sendEmail || false,
  });

  // Synchronize the local state with loggedInUserInfo if the user object changes
  useEffect(() => {
    setAlertType({
      sendSms: loggedInUserInfo?.user?.sendSMS || false,
      sendEmail: loggedInUserInfo?.user?.sendEmail || false,
    });
  }, [loggedInUserInfo]);

  const handleToggle = async (type) => {
    const updatedAlertType = {
      ...alertType,
      [type]: !alertType[type],
    };

    setAlertType(updatedAlertType);

    try {
      const res = await updateUserInfo({
        data: updatedAlertType,  // Use the updated alertType object
        token: loggedInUserInfo?.access_token,
      }).unwrap();

      if (res.success) {
        // Update Redux state with the response data
        dispatch(
          setUserInfo({
            ...loggedInUserInfo,
            user: {
              ...loggedInUserInfo.user,
              sendEmail: res?.data?.sendEmail,
              sendSMS: res?.data?.sendSms,
            },
          })
        );
        toast.dismiss();
        toast.success(res.msg);
      } else {
        toast.dismiss();
        toast.error(res.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update alert settings.");
    }
  };

  return (
    <div>
      <Header title="Alerts" />

      <div className="md:w-[600px] mx-auto p-16">
        <div className="flex flex-col gap-8">
          {/* SMS Alert Toggle */}
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex gap-4 items-center">
              <MessageSquareText className="text-blue-500" />
              <div className="text-sm leading-loose">
                <h5 className="font-bold capitalize">SMS</h5>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alertType.sendSms}
              onChange={() => handleToggle("sendSms")}
              className="w-5 h-5 cursor-pointer accent-blue-500"
            />
          </div>

          {/* Email Alert Toggle */}
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex gap-4 items-center">
              <Mail className="text-green-500" />
              <div className="text-sm leading-loose">
                <h5 className="font-bold capitalize">Email</h5>
              </div>
            </div>
            <input
              type="checkbox"
              checked={alertType.sendEmail}
              onChange={() => handleToggle("sendEmail")}
              className="w-5 h-5 cursor-pointer accent-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
