import React, { useState, useEffect } from "react";

const CountdownTimer = ({ totalSeconds }) => {
  const sanitizeSeconds = (val) => {
    const num = Number(val);
    return Number.isFinite(num) && num > 0 ? Math.floor(num) : 0;
  };

  const [secondsLeft, setSecondsLeft] = useState(() => sanitizeSeconds(totalSeconds));

  useEffect(() => {
    setSecondsLeft(sanitizeSeconds(totalSeconds));
  }, [totalSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft > 0]);

  function formatTimeValues(seconds) {
    const safeSec = sanitizeSeconds(seconds);
    const days = Math.floor(safeSec / 86400);
    const hours = Math.floor((safeSec % 86400) / 3600);
    const minutes = Math.floor((safeSec % 3600) / 60);
    const secs = safeSec % 60;

    const pad = (num) => (num < 10 ? `0${num}` : `${num}`);
    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(secs),
    };
  }

  const time = formatTimeValues(secondsLeft);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 font-primary shrink-0 select-none">
      {Number(time.days) > 0 && (
        <>
          <div className="bg-slate-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[38px] sm:min-w-[46px] shadow-sm flex flex-col items-center justify-center border border-slate-800">
            <span className="block text-xs sm:text-sm font-black leading-none text-emerald-400 font-mono tabular-nums">
              {time.days}
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
              Days
            </span>
          </div>
          <span className="text-amber-800 font-black text-xs sm:text-sm -mt-3 sm:-mt-3.5">:</span>
        </>
      )}

      <div className="bg-slate-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[38px] sm:min-w-[46px] shadow-sm flex flex-col items-center justify-center border border-slate-800">
        <span className="block text-xs sm:text-sm font-black leading-none text-emerald-400 font-mono tabular-nums">
          {time.hours}
        </span>
        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
          Hrs
        </span>
      </div>
      <span className="text-amber-800 font-black text-xs sm:text-sm -mt-3 sm:-mt-3.5">:</span>

      <div className="bg-slate-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[38px] sm:min-w-[46px] shadow-sm flex flex-col items-center justify-center border border-slate-800">
        <span className="block text-xs sm:text-sm font-black leading-none text-emerald-400 font-mono tabular-nums">
          {time.minutes}
        </span>
        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
          Min
        </span>
      </div>
      <span className="text-amber-800 font-black text-xs sm:text-sm -mt-3 sm:-mt-3.5">:</span>

      <div className="bg-slate-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[38px] sm:min-w-[46px] shadow-sm flex flex-col items-center justify-center border border-slate-800">
        <span className="block text-xs sm:text-sm font-black leading-none text-emerald-400 font-mono tabular-nums">
          {time.seconds}
        </span>
        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
          Sec
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
