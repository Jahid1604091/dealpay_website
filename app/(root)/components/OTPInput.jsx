'use client'

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

// assets
import Spinner from '@/public/gif/spinner.gif'
import Check from '@/public/gif/check.gif'

const OTPInput = ({setValue ,otpValue,setIsVisbleCheck}) => {
  
  const [otp, setOtp] = useState(otpValue && otpValue?.split('') || ['', '', '', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if(otp.join('').length === 6){
      setValue(otp.join(''))
      setIsVisbleCheck(true)
    }
    else{
      setIsVisbleCheck(false)
    }
  }, [otp]);

  const handleChange = (index, value, event) => {
    // If backspace is pressed and the current input is empty,
    // delete the content of the previous input field and move focus to it
    if (event.key === 'Backspace' && value === '' && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      refs[index - 1].current.focus();
      return;
    }
  
    // Ensure only digits are entered
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Focus on the next input field if value is entered
      if (value !== '' && index < refs.length - 1) {
        refs[index + 1].current.focus();
      }
    }
  };
  

  return (
    <div className='flex gap-2 items-center mt-10'>
      <div>
      {otp.map((digit, index) => (
        <input
          className='border-[1px] border-primary w-40 h-40 mr-6 rounded-md text-center focus:outline-none'
          key={index}
          type="number"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value, e)}
          onKeyDown={(e) => handleChange(index, digit, e)}
          ref={refs[index]}
        />
      ))}
      </div>
      {/* {otpChecking && <Image height={50} width={50} src={Spinner} alt='Dealpay Spinner Animation'/>} */}
    </div>
  );
};

export default OTPInput;
