import React, { useRef, useEffect } from "react";

function OtpInput({ otp, setOtp, error, length = 6, onLengthChange }) {
  const inputRefs = useRef([]);

  // Adjust refs array length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp.length]);

  const handleChange = (event, index) => {
    const val = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const lastChar = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    // Auto-advance focus to next input
    if (index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const rawData = event.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .trim();

    if (!rawData) return;

    // If pasted data is 8 chars and currently 6, adapt if callback provided
    if (rawData.length >= 8 && otp.length === 6 && onLengthChange) {
      onLengthChange(8, rawData.slice(0, 8));
      return;
    }

    const targetLength = otp.length;
    const cleanData = rawData.slice(0, targetLength);
    const newOtp = [...otp];
    for (let i = 0; i < targetLength; i++) {
      newOtp[i] = cleanData[i] || "";
    }
    setOtp(newOtp);
    const targetIndex = Math.min(cleanData.length, targetLength - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  return (
    <div
      className={`flex items-center justify-center flex-wrap ${
        otp.length > 6 ? "gap-1.5 sm:gap-2" : "gap-2 sm:gap-2.5"
      }`}
      onPaste={handlePaste}
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onChange={(event) => handleChange(event, index)}
          className={`${
            otp.length > 6
              ? "w-8 h-10 sm:w-9 sm:h-11 text-base sm:text-lg"
              : "w-10 h-12 sm:w-11 sm:h-13 text-lg sm:text-xl"
          } text-center font-black rounded-xl border transition-all ${
            error
              ? "border-rose-300 bg-rose-50/50 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : digit
              ? "border-emerald-500 bg-emerald-50/30 text-emerald-950 font-black shadow-xs focus:ring-2 focus:ring-emerald-500/20"
              : "border-slate-200 bg-slate-50/60 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          } focus:outline-none`}
        />
      ))}
    </div>
  );
}

export default OtpInput;


