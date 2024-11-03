"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
// import { useGetAllCurrenciesQuery } from "@/app/(root)/redux/slices/authApiSlice";
import Header from "../../components/Header";
import Icon from "@/app/(root)/components/Icon";
import CameraCapture from "@/app/(root)/components/CameraCapture";
import { BASE_URL } from "@/app/utils/constants";
import { setTempLogout } from "@/app/(root)/redux/slices/authSlice";
import { useUpdateUserMutation } from "@/app/(root)/redux/slices/authApiSlice";
const professions = [
  {
    id: 1,
    name: "Investor",
  },
  {
    id: 2,
    name: "Enterprenuer",
  },
  {
    id: 3,
    name: "Doctor",
  },
];

const AccountDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  // const { data } = useGetAllCurrenciesQuery();
  const { loggedInUserInfo } = useSelector((state) => state.auth);
  const [updateUser] = useUpdateUserMutation();

  const logoPicRef = useRef(null);
  const [logoPic, setLogoPic] = useState(null);
  const [yourPic, setYourPic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureType, setCaptureType] = useState(null);

  useEffect(() => {
    setName(loggedInUserInfo?.user?.name);
    setEmail(loggedInUserInfo?.user?.email || loggedInUserInfo?.user?.number);
    setGender(loggedInUserInfo?.user?.gender);
    setAddress(loggedInUserInfo?.user?.address);
    setProfession(loggedInUserInfo?.user?.profession);
  }, [loggedInUserInfo]);
  // const [selectedCurencies, setSelectedCurrencies] = useState([]);

  const handleLogoPicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setLogoPic({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (imageUrl) => {
    const imageFile = dataURLtoFile(imageUrl, "captured-image.png");
    if (captureType === "userPic") {
      setYourPic({ file: imageFile, imageUrl });
    } else if (captureType === "logo") {
      setLogoPic({ file: imageFile, imageUrl });
    }
    setIsCameraOpen(false);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  // const handleCurrencyChange = (e) => {
  //   const currencyId = e.target.value;
  //   if (
  //     !selectedCurrencies.some((currency) => currency._id === currencyId) &&
  //     selectedCurrencies.length < 2
  //   ) {
  //     const selectedCurrency = data?.currencies.find(
  //       (currency) => currency._id === currencyId
  //     );
  //     setSelectedCurrencies((prev) => [...prev, selectedCurrency]);
  //   } else if (selectedCurrencies.length >= 2) {
  //     toast.warn("You can only select up to 2 currencies.");
  //   }
  // };

  // const removeCurrency = (currencyId) => {
  //   setSelectedCurrencies((prev) =>
  //     prev.filter((currency) => currency._id !== currencyId)
  //   );
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const refinedData = {
      profession,
    };
    formData.append("info", JSON.stringify(refinedData));
    formData.append("profilepicture", yourPic?.file);
    // formData.append("logo", logoPic.file);
    try {
      const res = await updateUser({
        data: formData,
        token: loggedInUserInfo?.access_token,
      }).unwrap();

      if (res.success) {
        toast.success(res.msg);
        dispatch(setTempLogout());
        router.push("/auth/login");
      }
    } catch (error) {
      console.log(`Error in update user ${error}`);
    }
  };

  return (
    <>
      <Header title="Account Details" />

      <div className="md:w-[600px] mx-auto p-16">
        <div className="flex flex-col gap-8">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-30">
              <div className="flex flex-col">
                <label className="text-secondary pb-2 ">
                  {t("Capture your picture")}
                </label>
                <div
                  className="border-[.5px] border-primary rounded-2xl w-[245px] h-[200px] mx-auto md:mx-0 flex justify-center items-end bg-center bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url(${yourPic?.imageUrl})`,
                  }}
                >
                  <div
                    className="p-2 rounded-2xl border-[.5px] mx-auto md:mx-0 border-primary_thin mb-2 grid justify-center items-end cursor-pointer"
                    onClick={() => {
                      setCaptureType("userPic");
                      setIsCameraOpen(true);
                    }}
                  >
                    <Icon
                      path={"camera"}
                      name={"camera"}
                      height={30}
                      width={30}
                    />
                    <p className="text-[10px]">{t("Camera")}</p>
                  </div>
                </div> 
                
              </div>

              {/* Business Type */}
              <div className="flex flex-col">
                {loggedInUserInfo?.accountType == "business" && (
                  <>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoPicChange}
                      ref={logoPicRef}
                    />
                    <label className="text-secondary pb-2 border-b-[1px] border-primary">
                      Logo Pic
                    </label>
                    <div
                      className="border-[.5px] border-primary mx-auto md:mx-0 rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
                      style={{
                        backgroundImage: `url(${logoPic?.imageUrl})`,
                      }}
                    >
                      <div className=" p-2 rounded-2xl border-[.5px] border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                        <div
                          className="grid justify-center items-end cursor-pointer"
                          onClick={() => logoPicRef.current.click()}
                        >
                          <Icon
                            className="border-[1px] "
                            path={"gallary"}
                            name={"gallary"}
                            height={28}
                            width={28}
                          />
                          <p className="text-[10px]">{t("Gallary")}</p>
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setCaptureType("logo");
                            setIsCameraOpen(true);
                          }}
                        >
                          <Icon
                            className="border-[1px] "
                            path={"camera"}
                            name={"camera"}
                            height={30}
                            width={30}
                          />
                          <p className="text-[10px]">{t("Camera")}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-secondary pb-2 border-b-[1px] border-primary">
                  {t("Profession")}
                </label>
                <select
                  value={profession}
                  className="cursor-pointer  text-gray-700 py-2 px-4 focus:outline-none focus:ring-0 focus:border-blue-500"
                  onChange={(e) => setProfession(e.target.value)}
                >
                  {professions.map((profession) => (
                    <option
                      key={profession.id}
                      value={profession.name}
                      className="bg-gray-100 text-gray-700"
                    >
                      {profession.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="border-b-[1px] text-xl text-secondary border-primary">
                  {t("Your Name")}
                </label>
                <input
                  disabled
                  type="name"
                  className="text-secoundary w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor=""
                  className="border-b-[1px] text-xl text-secondary border-primary"
                >
                  {t("Gender")}
                </label>
                <select
                  disabled
                  className="cursor-pointer"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="border-b-[1px] text-xl text-secondary border-primary">
                  Email/Number
                </label>
                <input
                  disabled
                  type="email"
                  className="text-secoundary w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="border-b-[1px] text-xl text-secondary border-primary">
                  {t("Address")}
                </label>
                <textarea
                  disabled
                  type="text"
                  className="text-secoundary w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              {/* <div className="flex flex-col">
                <label className="border-b-[1px] text-xl text-secondary border-primary">
                  Select a currency
                </label>
                <select
                  className="cursor-pointer text-gray-700 py-2 px-4 mb-4"
                  onChange={handleCurrencyChange}
                >
                  {data?.currencies.map((currency) => (
                    <option key={currency._id} value={currency._id}>
                      {currency.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap space-x-4 mt-4">
                  {selectedCurrencies.map((currency) => (
                    <div
                      key={currency._id}
                      className="flex items-center space-x-2 py-2 px-4 text-gray-700 bg-gray-200 rounded"
                    >
                      <span>{currency.name}</span>
                      <button
                        className="text-red-500"
                        onClick={() => removeCurrency(currency._id)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-center justify-center mt-10">
              <SecondaryButton
                text={t(`Can't submit`)}
                button_text={t("Talk with team")}
                link={"/support"}
              />
              <button type="submit" className="btn-primary">
                <RefreshCcw />
                {t("Update Now")}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </>
  );
};

export default AccountDetails;
