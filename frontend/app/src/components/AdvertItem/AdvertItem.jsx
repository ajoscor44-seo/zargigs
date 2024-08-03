import React from "react";
import CountdownTimer from "../CountDownTimer/CountDownTimer";

const AdvertItem = ({ itemData }) => {
  return (
    <div className="border py-1 rounded mx-4">
      <img
        className="w-full h-48 object-cover border-b"
        src={itemData.banner}
      />
      <div className="px-2 flex flex-col gap-1 my-1">
        <h2 className="font-semibold">
          Name: <span className="text-green-500">{itemData.name}</span>
        </h2>
        <p className="font-semibold">
          Contact: <span className="text-green-500">{itemData.link}</span>
        </p>
        <p className="font-semibold">
          Description:{" "}
          <span className="text-green-500">{itemData.description}</span>
        </p>
        <CountdownTimer
          totalSeconds={Math.floor(
            (new Date(itemData.expiresAt).getTime() - new Date().getTime()) /
              1000
          )}
        />
      </div>
    </div>
  );
};

export default AdvertItem;
