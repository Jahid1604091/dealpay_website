"use client";

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Icon from "@/app/(root)/components/Icon";
import CameraCapture from "@/app/(root)/components/CameraCapture";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import Header from "@/app/(root)/components/Header";
import { setInfo, setStep } from "@/app/(root)/redux/slices/authSlice";

export default function Ekyc() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const { info } = useSelector((state) => state.auth);
  const [frontPicSelected, setFrontPicSelected] = useState(false);
  const [isNid, setIsNid] = useState(info?.isNid || false);
  const documentFrontPicRef = useRef(null);
  const documentBackPicRef = useRef(null);
  const logoPicRef = useRef(null);
  const tradePic1Ref = useRef(null);
  const tradePic2Ref = useRef(null);
  const tradePic3Ref = useRef(null);
  const tradePic4Ref = useRef(null);
  const [yourPic, setYourPic] = useState(info?.yourPic || null);
  const [kyc_personal_front_pic, setKycPersonalFrontPic] = useState(
    info?.kyc_personal_front_pic || null
  );
  const [kyc_personal_back_pic, setKycPersonalBackPic] = useState(
    info?.kyc_personal_back_pic || null
  );
  const [logoPic, setLogoPic] = useState(info?.logoPic || null);
  const [tradePic1, setTradePic1] = useState(info?.tradePic1 || null);
  const [tradePic2, setTradePic2] = useState(info?.tradePic2 || null);
  const [tradePic3, setTradePic3] = useState(info?.tradePic3 || null);
  const [tradePic4, setTradePic4] = useState(info?.tradePic4 || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [captureType, setCaptureType] = useState(null); 



  const handleDocumentFrontPicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setKycPersonalFrontPic({ file, imageUrl });
        setFrontPicSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentBackPicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setKycPersonalBackPic({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleTradePic1Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setTradePic1({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleTradePic2Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setTradePic2({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleTradePic3Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setTradePic3({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleTradePic4Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setTradePic4({ file, imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserPicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        // setSignupData((prevData) => ({
        //   ...prevData,
        //   yourPic: { file, imageUrl },
        // }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (imageUrl) => {
    const imageFile = dataURLtoFile(imageUrl, "captured-image.png"); // Convert data URL to file object
    if (captureType === "userPic") {
      setYourPic({ file: imageFile, imageUrl });
    } else if (captureType === "front") {
      setKycPersonalFrontPic({ file: imageFile, imageUrl });
      setFrontPicSelected(true);
    } else if (captureType === "back") {
      setKycPersonalBackPic({ file: imageFile, imageUrl });
    } else if (captureType === "logo") {
      setLogoPic({ file: imageFile, imageUrl });
    } else if (captureType === "trade1") {
      setTradePic1({ file: imageFile, imageUrl });
    } else if (captureType === "trade2") {
      setTradePic2({ file: imageFile, imageUrl });
    } else if (captureType === "trade3") {
      setTradePic3({ file: imageFile, imageUrl });
    } else if (captureType === "trade4") {
      setTradePic4({ file: imageFile, imageUrl });
    }
    setIsCameraOpen(false);
  };

  // Helper function to convert data URL to file object
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      info?.accountType == "personal" &&
      yourPic?.file &&
      kyc_personal_front_pic?.file
    ) {
      dispatch(
        setInfo({
          ...info,
          kyc_personal_front_pic,
          kyc_personal_back_pic,
          yourPic,
          isNid,
        })
      );

      dispatch(setStep(4));
      // router.push("/auth/signup/subscription");
    } else if (
      info?.accountType == "business" &&
      yourPic?.file &&
      kyc_personal_front_pic?.file &&
      logoPic?.file &&
      tradePic1?.file &&
      tradePic2?.file &&
      tradePic3?.file &&
      tradePic4?.file
    ) {
      dispatch(
        setInfo({
          ...info,
          kyc_personal_front_pic,
          kyc_personal_back_pic,
          yourPic,
          isNid,
          logoPic,
          tradePic1,
          tradePic2,
          tradePic3,
          tradePic4,
        })
      );
      dispatch(setStep(4));
      // router.push("/auth/signup/subscription");
    } else {
      toast.error("Please process all and upload all necessary images");
    }
  };

  return (
    <>
      <Header title={`E-KYC ${info?.accountType}`} />
      <section className="max-w-[480px] my-30 mx-auto p-16">
        <form onSubmit={handleSubmit}>
          {/* profile pic */}
          <main className="flex flex-col justify-center items-center">
            <div className="">
              <p className="font-semibold mb-6 py-2 text-center md:text-start">
                {t('Capture your picture')}
              </p>
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
                    className="border-[1px] "
                    path={"camera"}
                    name={"camera"}
                    height={30}
                    width={30}
                  />
                  <p className="text-[10px]">{t('Camera')}</p>
                </div>
              </div>
            </div>
            {/* Docs */}
            <div className="mt-20">
              <p className="font-semibold mb-6 py-2 text-center md:text-start">
                {t('Select docs')}
              </p>
              <div className="flex gap-2 mb-5 justify-center items-center md:justify-start ">
                <div
                  className={`flex flex-col justify-center items-center cursor-pointer ${
                    isNid ? "opacity-100" : "opacity-20"
                  }`}
                  onClick={() => setIsNid(true)}
                >
                  <Icon
                    className="border-[1px]"
                    path={"nid"}
                    name={"nid"}
                    height={20}
                    width={20}
                  />
                  <p className="text-sm">{t('NID')}</p>
                </div>

                <div
                  className={`flex flex-col justify-center items-center cursor-pointer ${
                    !isNid ? "opacity-100" : "opacity-20"
                  }`}
                  onClick={() => setIsNid(false)}
                >
                  <Icon
                    className="border-[1px]"
                    path={"passport"}
                    name={"passport"}
                    height={20}
                    width={20}
                  />
                  <p className="text-sm">{t('Passport')}</p>
                </div>
              </div>
              {/* Gallery */}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleDocumentFrontPicChange}
                ref={documentFrontPicRef}
              />
              {isNid && (
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleDocumentBackPicChange}
                  ref={documentBackPicRef}
                />
              )}

              {info?.accountType == "business" && (
                <>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoPicChange}
                    ref={logoPicRef}
                  />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleTradePic1Change}
                    ref={tradePic1Ref}
                  />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleTradePic2Change}
                    ref={tradePic2Ref}
                  />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleTradePic3Change}
                    ref={tradePic3Ref}
                  />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleTradePic4Change}
                    ref={tradePic4Ref}
                  />
                </>
              )}

              <p className="font-semibold mb-6 py-2 text-center md:text-start">
                {isNid ? "NID" : "Passport"} Front Pic
              </p>
              <div
                className="border-[.5px] border-primary rounded-2xl w-[245px] h-[200px] flex justify-center mx-auto md:mx-0 items-end bg-center bg-no-repeat bg-contain"
                style={{
                  backgroundImage: `url(${kyc_personal_front_pic?.imageUrl})`,
                }}
              >
                <div className="p-2 rounded-2xl border-[.5px] mx-auto md:mx-0 border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                  <div
                    className="grid justify-center items-end cursor-pointer"
                    onClick={() => documentFrontPicRef.current.click()}
                  >
                    <Icon
                      className="border-[1px] "
                      path={"gallary"}
                      name={"gallary"}
                      height={28}
                      width={28}
                    />
                    <p className="text-[10px]">{t('Gallary')}</p>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setCaptureType("front");
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
                    <p className="text-[10px]">{t('Camera')}</p>
                  </div>
                </div>
              </div>

              {isNid && (
                <>
                  <p className="font-semibold mb-6 py-2 text-center md:text-start">
                    NID Back Pic
                  </p>
                  <div
                    className="border-[.5px] border-primary mx-auto md:mx-0 rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
                    style={{
                      backgroundImage: `url(${kyc_personal_back_pic?.imageUrl})`,
                    }}
                  >
                    <div className="p-2 rounded-2xl border-[.5px] mx-auto md:mx-0 border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                      <div
                        className="grid justify-center items-end cursor-pointer"
                        onClick={() => documentBackPicRef.current.click()}
                      >
                        <Icon
                          className="border-[1px] "
                          path={"gallary"}
                          name={"gallary"}
                          height={28}
                          width={28}
                        />
                        <p className="text-[10px]">{t('Gallary')}</p>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setCaptureType("back");
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
                        <p className="text-[10px]">{t('Camera')}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Business Type */}
              {info?.accountType == "business" && (
                <>
                  <p className="font-semibold mb-6 py-2 text-center md:text-start">
                    Logo Pic
                  </p>
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
                        <p className="text-[10px]">{t('Gallary')}</p>
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
                        <p className="text-[10px]">{t('Camera')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <div>
                      <p className="font-semibold mb-6 py-2 text-center md:text-start">
                        Trade Liscense Pic 1
                      </p>
                      <div
                        className="border-[.5px] border-primary mx-auto md:mx-0 rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
                        style={{
                          backgroundImage: `url(${tradePic1?.imageUrl})`,
                        }}
                      >
                        <div className="p-2 rounded-2xl border-[.5px]  border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                          <div
                            className="grid justify-center items-end cursor-pointer"
                            onClick={() => tradePic1Ref.current.click()}
                          >
                            <Icon
                              className="border-[1px] "
                              path={"gallary"}
                              name={"gallary"}
                              height={28}
                              width={28}
                            />
                            <p className="text-[10px]">{t('Gallary')}</p>
                          </div>
                          <div
                            className="grid justify-center items-end w-auto cursor-pointer"
                            onClick={() => {
                              setCaptureType("trade1");
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
                            <p className="text-[10px]">{t('Camera')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {tradePic1 && (
                      <div>
                        <p className="font-semibold mb-6 py-2 text-center md:text-start">
                          Trade Liscense Pic 2
                        </p>
                        <div
                          className="border-[.5px] border-primary mx-auto md:mx-0 rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: `url(${tradePic2?.imageUrl})`,
                          }}
                        >
                          <div className=" p-2 rounded-2xl border-[.5px]  border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                            <div
                              className=" cursor-pointer"
                              onClick={() => tradePic2Ref.current.click()}
                            >
                              <Icon
                                className="border-[1px] "
                                path={"gallary"}
                                name={"gallary"}
                                height={28}
                                width={28}
                              />
                              <p className="text-[10px]">{t('Gallary')}</p>
                            </div>
                            <div
                              className=" cursor-pointer"
                              onClick={() => {
                                setCaptureType("trade2");
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
                              <p className="text-[10px]">{t('Camera')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {tradePic1 && tradePic2 && (
                      <div>
                        <p className="font-semibold mb-6 py-2 text-center md:text-start">
                          Trade Liscense Pic 3
                        </p>
                        <div
                          className="border-[.5px] border-primary mx-auto md:mx-0 rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: `url(${tradePic3?.imageUrl})`,
                          }}
                        >
                          <div className="p-2 rounded-2xl border-[.5px]  border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                            <div
                              className="cursor-pointer"
                              onClick={() => tradePic3Ref.current.click()}
                            >
                              <Icon
                                className="border-[1px] "
                                path={"gallary"}
                                name={"gallary"}
                                height={28}
                                width={28}
                              />
                              <p className="text-[10px]">{t('Gallary')}</p>
                            </div>
                            <div
                              className="w-auto cursor-pointer"
                              onClick={() => {
                                setCaptureType("trade3");
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
                              <p className="text-[10px]">{t('Camera')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {tradePic1 && tradePic2 && tradePic3 && (
                      <div>
                        <p className="font-semibold mb-6 py-2 text-center md:text-start">
                          Trade Liscense Pic 4
                        </p>
                        <div
                          className="border-[.5px] border-primary mx-auto md:mx-0  rounded-2xl w-[245px] h-[200px] flex justify-center items-end bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: `url(${tradePic4?.imageUrl})`,
                          }}
                        >
                          <div className="p-2 rounded-2xl border-[.5px] border-primary_thin mb-2 flex gap-2 items-center justify-evenly bg-white">
                            <div
                              className="cursor-pointer"
                              onClick={() => tradePic4Ref.current.click()}
                            >
                              <Icon
                                className="border-[1px] "
                                path={"gallary"}
                                name={"gallary"}
                                height={28}
                                width={28}
                              />
                              <p className="text-[10px]">{t('Gallary')}</p>
                            </div>
                            <div
                              className=" cursor-pointer"
                              onClick={() => {
                                setCaptureType("trade4");
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
                              <p className="text-[10px]">{t('Camera')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col gap-16 md:gap-2 md:flex-row items-center justify-between mt-80">
              <SecondaryButton
                text={t(`Can't submit`)}
                button_text={t('Talk with team')}
                link="/support"
              />
              <button type="submit" className="btn-primary">
                {t('Continue')}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </main>
        </form>

        {isCameraOpen && (
          <CameraCapture
            onCapture={handleCapture}
            onClose={() => setIsCameraOpen(false)}
          />
        )}
      </section>
    </>
  );
}
