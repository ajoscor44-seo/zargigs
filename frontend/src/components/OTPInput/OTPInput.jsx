import React, { useState, useRef } from "react";

function OtpInput({ otp, setOtp }) {
  const inputRefs = useRef([]);

  const handleChange = (event, index) => {
    if (event.target.value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = event.target.value;
      setOtp(newOtp);

      // Moves focus to the to and fro on input field
      if (event.target.value) {
        const nextIndex = index + 1;
        if (nextIndex < otp.length) {
          inputRefs.current[nextIndex].focus();
        }
      } else {
        const prevIndex = index - 1;
        if (prevIndex < otp.length) {
          inputRefs.current[prevIndex].focus();
        }
      }
    }
  };

  return (
    <div className={`grid ${"grid-cols-" + otp.length} gap-2`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="number"
          maxLength={1}
          value={digit}
          onChange={(event) => handleChange(event, index)}
          className={
            "border py-1 px-2 rounded outline-green-500 text-2xl font-bold text-center numberInputWithoutControl"
          }
        />
      ))}
    </div>
  );
}

export default OtpInput;
