import React from "react";
import construction_img from "../assets/svg/under_construction.svg";
import CountdownTimer from "../components/CountDownTimer/CountDownTimer";

function timeDifferenceInSeconds() {
  const currentTime = new Date();
  let targetTime = new Date();
  targetTime.setHours(19, 0, 0, 0);
  const differenceInMilliseconds = targetTime - currentTime;
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  return differenceInSeconds;
}

// Example usage:
const UnderConstruction = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-3 py-3 max-w-sm px-2 justify-center items-center border rounded align-middle">
        <img src={construction_img} alt="Under Construction Image" />
        <p className="font-bold text-xl">We are under construction</p>
        <div className="border w-full px-3 py-2 rounded">
          <h2 className="font-semibold mb-2 text-lg">Check back in:</h2>
          <CountdownTimer totalSeconds={() => timeDifferenceInSeconds()} />
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
