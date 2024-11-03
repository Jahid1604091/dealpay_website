import Link from "next/link";
import React from "react";

const SecondaryButton = ({text,button_text,link}) => {
  return (
    <div className="bg-light-black-bg rounded-3xl w-full max-w-[340px] py-10 text-center px-2 text-light-black-text">
      {text}
      <Link
        className="font-semibold border-b-[2px] border-light-black-text"
        href={link}
      >
        {button_text}
      </Link>
    </div>
  );
};

export default SecondaryButton;
