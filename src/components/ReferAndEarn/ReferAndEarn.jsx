import React from "react";
import { GiTakeMyMoney } from "react-icons/gi";

const ReferAndEarn = ({ username, referralLink }) => {
  return (
    <div className="mt-5 bg-white">
      <div className="flex justify-between p-3 font-primary border-b">
        <h2 className="font-semibold flex items-end gap-1">
          <span>Refer and Earn</span>
          <GiTakeMyMoney size={25} className="text-primary" />
        </h2>
        <button className="rounded-full bg-primaryLight text-white text-xs px-2 py-1 cursor-pointer">
          INVITE FRIENDS
        </button>
      </div>
      <div className="px-3 py-4 flex flex-col justify-center items-center">
        <h2 className="text-sm mb-2">My Referral Link:</h2>
        <div className="flex">
          <div className="p-2 border bg-slate-200 rounded-s">
            {referralLink}
          </div>
          <button className="text-white cursor-pointer rounded-r py-2 px-3 bg-primaryLight">
            COPY
          </button>
        </div>
        <p className="text-xs mt-2 text-center">
          Or You can tell your referral to use your username{" "}
          <span className="font-bold">({username})</span> under the referral
          section at the point of registration.
        </p>
      </div>
    </div>
  );
};

export default ReferAndEarn;
