'use client'

import OnBoarding from "@/app/(root)/components/OnBoarding";
import { useEffect } from "react";
import { generateToken, messaging } from "../utils/firebase";
import { onMessage } from "firebase/messaging";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";


const Page = () => {
  const router = useRouter();
  const {verifiedUserInfo} = useSelector(state=>state.auth);

  useEffect(()=>{
   if(verifiedUserInfo?.token){
    router.push('/auth/login')
   }
  },[verifiedUserInfo])
  return (
    <OnBoarding/>
  );
};

export default Page;