import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import Chat from "../Chat/Chat";

const ManualFunding = () => {
  return (
    <div>
      <div className="p-2 flex flex-col gap-2 py-3">
        <div className="flex flex-wrap gap-2">
          <h3 className="text-md font-semibold text-gray-400">Bank Name:</h3>
          <p className="text-md font-bold">Moniepoint Microfinance Bank</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <h3 className="text-md font-semibold text-gray-400">Acct Name:</h3>
          <p className="text-md font-bold">Monnify-BuySub</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <h3 className="text-md font-semibold text-gray-400">Acct Number:</h3>
          <p className="text-md font-bold">6493072868</p>
        </div>
      </div>
      <h2 className="flex font-bold px-2 py-4 text-sm gap-2 text-orange-500 bg-slate-50">
        <BiInfoCircle size={25} />
        <span className="flex-1">
          Transfer to the above account. The amount you transferred will
          transferred into your gigsflix account once it has been confirmed.
        </span>
      </h2>
      <h2 className="flex font-bold px-2 py-4 text-sm gap-2 text-sky-500 bg-sky-50">
        <BiInfoCircle size={25} />
        <span className="flex-1">
          NOTE: For confirmation, send the screenshot of the payment you made to
          the Transaction Confirmation Team for confirmation.
        </span>
      </h2>
      <h2 className="flex font-bold px-2 py-4 text-sm gap-2 text-orange-500 bg-sky-50">
        <BiInfoCircle size={25} />
        <span className="flex-1">
          Contact Support using the chat button below.
        </span>
      </h2>
      <Chat whatsappLink={"https://wa.link/tfwje6"} />
    </div>
  );
};

export default ManualFunding;
