import React, { useRef } from "react";

function OtpInput({ otp, setOtp, error }) {
  const inputRefs = useRef([]);

  const handleChange = (event, index) => {
    const val = event.target.value.replace(/\D/g, "");
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
        inputRefs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .trim()
      .slice(0, otp.length);
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < otp.length) {
        newOtp[i] = pasteData[i];
      }
    }
    setOtp(newOtp);
    const targetIndex = Math.min(pasteData.length, otp.length - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-2.5"
      onPaste={handlePaste}
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onChange={(event) => handleChange(event, index)}
          className={`w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold rounded-xl border transition-all ${
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

