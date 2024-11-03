"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Header from "@/app/(root)/components/Header";
import SecondaryButton from "@/app/(root)/components/SecondaryButton";
import { setClearState } from "../../redux/slices/authSlice";

export default function Success() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const { email } = useSelector((state) => state.auth);

  setTimeout(() => {
    dispatch(setClearState())
  }, 2000);
  return (
    <>
      <Header title="Submitted" />
      <section className="max-w-[600px] my-30 mx-auto p-16">
        <div className="flex flex-col md:flex-row  items-center justify-center">
          <div>
            <Image
              src="/icons/search.svg"
              width={200}
              height={200}
              alt="search"
            />
          </div>
          <div>
            <p className="text-3xl text-center md:text-start">
              {t('Thanks')}! <br />
             {t('Your Account')} <strong>{email}</strong>
              <br />
              {t('is status')} <span className="text-primary">{t('under review')}</span>{" "}
              <br />
             {t('usualy it will take 12 to 24 hours')}
            </p>
          </div>
        </div>

        <div className="flex gap-16 md:gap-2 flex-col md:flex-row items-center justify-between mt-80">
          <SecondaryButton
            text="Didn't approved ?"
            button_text="Talk with Team"
            link="/support"
          />
          <Link href="/auth/login" className="btn-primary">
            Login
          </Link>
        </div>
      </section>
    </>
  );
}
