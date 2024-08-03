import React, { useState, useEffect } from "react";

const CountdownTimer = ({ totalSeconds }) => {
  // Initialize timer state e.g 3600 seconds (1 hour)
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    // Set up the interval
    const intervalId = setInterval(() => {
      if (secondsLeft > 0) {
        return setSecondsLeft((secondsLeft) => secondsLeft - 1);
      }
      clearInterval(intervalId);
      return () => setSecondsLeft(0); // Ensure the timer shows 0 and does not go negative
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  // Helper function to format seconds into hours minutes seconds
  function startTimer(seconds) {
    const days = Math.floor(seconds / 86400000);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    const formatTime = (time) => {
      return time < 10 ? "0" + time : time;
    };

    return {
      days: formatTime(days),
      hours: formatTime(hours),
      minutes: formatTime(minutes),
      seconds: formatTime(secondsLeft),
    };
  }

  const timeObject = startTimer(secondsLeft);

  return (
    <div className="flex justify-between pb-2">
      <span className="border p-2 rounded-sm text-center">
        <h2 className="font-bold text-2xl text-green-500">{timeObject.days}</h2>
        <span className="font-semibold text-sm text-center">Days</span>
      </span>
      <span className="border p-2 rounded-sm text-center">
        <h2 className="font-bold text-2xl text-green-500">
          {timeObject.hours}
        </h2>
        <span className="font-semibold text-sm text-center">Hours</span>
      </span>
      <span className="border p-2 rounded-sm text-center">
        <h2 className="font-bold text-2xl text-green-500">
          {timeObject.minutes}
        </h2>
        <span className="font-semibold text-sm text-center">Minutes</span>
      </span>
      <span className="border p-2 rounded-sm text-center">
        <h2 className="font-bold text-2xl text-green-500">
          {timeObject.seconds}
        </h2>
        <span className="font-semibold text-sm text-center">Seconds</span>
      </span>
    </div>
  );
};

export default CountdownTimer;
