import React, { useRef, useState } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaCopy, FaFileCircleCheck } from "react-icons/fa6";
import CopyToClipboard from "../../hooks/CopyToClipboard";

const ReferAndEarn = ({ username }) => {
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;
  const referralLink = `${app_url}/ref/${username}`;
  const inputRef = useRef(null);
  const [textIsCopied, setTextIsCopied] = useState(false);

  const copyToClipboard = () => {
    const textIsCopied = CopyToClipboard(inputRef);
    if (textIsCopied) setTextIsCopied(true);
    alert("Copied your invite link. Now share to spread the love and update");

    const timeToReset = setTimeout(() => {
      setTextIsCopied(false);
      clearTimeout(timeToReset);
    }, 5000);
  };

  return (
    <div className="mt-5 bg-white">
      <div className="flex justify-between p-3 font-primary border-b">
        <h2 className="font-semibold flex items-end gap-1">
          <span>Refer and Earn</span>
          <GiTakeMyMoney size={25} className="text-primary" />
        </h2>
        <Link to="/invite">
          <div className="rounded-full bg-green-500 text-white text-center text-xs px-2 py-1 cursor-pointer">
            INVITE FRIENDS
          </div>
        </Link>
      </div>
      <div className="px-3 py-4 flex flex-col justify-center items-center">
        <h2 className="text-sm mb-2">My Referral Link:</h2>
        <div className="flex">
          <div className="p-2 border bg-slate-200 rounded-s">
            {referralLink}
          </div>
          <textarea
            ref={inputRef}
            rows={25}
            className="p-2 border bg-slate-200 rounded-s hidden"
            defaultValue={referralLink}
          ></textarea>
          <button
            onClick={copyToClipboard}
            className="text-white cursor-pointer rounded-r py-2 px-3 bg-green-500"
          >
            {textIsCopied ? (
              <FaFileCircleCheck size={20} />
            ) : (
              <FaCopy size={20} />
            )}
          </button>
        </div>
        <p className="text-xs mt-2 text-center text-slate-600">
          Or you can tell your friends to enter your username{" "}
          <span className="font-bold text-slate-900">({username})</span> under the referral
          section at registration. You'll receive instant cash bonuses as soon as they proceed with account activation or complete their first withdrawal!
        </p>
      </div>
    </div>
  );
};

export default ReferAndEarn;
