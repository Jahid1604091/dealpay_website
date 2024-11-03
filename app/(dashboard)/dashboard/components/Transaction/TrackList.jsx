import React from "react";
import { CircleCheck } from "lucide-react";

const TrackList = ({ transactionData }) => {

  const steps = [
    {
      id: 1,
      name: "Information submit",
      icon: <CircleCheck size={40} />,
      status: "success",
    },
    {
      id: 2,
      name: "OTP Verification",
      icon: <CircleCheck size={40} />,
      status: "success",
    },
    {
      id: 3,
      name: "Documents",
      icon: <CircleCheck size={40} />,
      status: "success",
    },
    {
      id: 4,
      name: "Status",
      icon: <CircleCheck size={40} />,
      status: "success",
    },
  ];

  // if(!transactionData){
  //   return "No Data Found!"
  // }
  
  return (
    <>
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row items-center relative space-y-40 md:space-y-0 md:space-x-40">
          {/* Use flex-col on mobile and flex-row on medium and larger screens */}
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center p-4 rounded-lg w-full md:w-auto relative"
            >
              {/* Line connecting the titles */}
              {index !== steps.length - 1 && (
                <div
                  className={`${
                    index !== steps.length - 1 && "block md:hidden"
                  } absolute left-22 top-40 h-full w-px bg-gray-400 transform translate-y-4 md:translate-x-0 md:translate-y-0 md:w-full md:h-px md:top-auto md:bottom-8 md:left-full`}
                ></div>
              )}
              {/* Icon */}
              <div
                className={`rounded-full flex items-center justify-center mr-4 ${
                  step.status === "completed"
                    ? "bg-green-500 text-white"
                    : step.status === "current"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {step.icon}
              </div>
              {/* Text */}
              <div className="text-left">
                <p className="text-lg font-semibold">{step.name}</p>
                <p className="text-sm mt-2"> Success
                  {/* {step.id === 3
                    ? transactionData?.isReviewed
                      ? "Success"
                      : "Not yet"
                    : step.id === 4
                    ? !transactionData?.isReviewed
                      ? "Details not opened yet" // If not reviewed, display this text
                      : transactionData.isVerified
                      ? "Payment Received" // If reviewed and verified, display this text
                      : `Rejected (${transactionData?.rejectMessage})`
                    : "Success"} */}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TrackList;
