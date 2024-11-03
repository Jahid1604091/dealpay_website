import {MoveLeft} from 'lucide-react';
import { useRouter } from "next/navigation";
import React from "react";

const Header = ({title=''}) => {
    const router = useRouter();
  return (
    <div className="flex gap-1 bg-primary border text-white font-bold w-full items-center justify-center py-6 auth-top z-100">
      <button onClick={() => router.back()} className="z-100">
        <MoveLeft size={30}/>
      </button>
      <h2 className="lg:text-4xl text-2xl">{title}</h2>
    </div>
  );
};

export default Header;
