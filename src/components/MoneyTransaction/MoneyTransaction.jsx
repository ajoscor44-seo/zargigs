import React from "react";
import { FaWallet } from "react-icons/fa6";
import { CiBank } from "react-icons/ci";

const MoneyTransaction = () => {
  return (
    <div className="bg-white px-10 py-3 flex justify-between items-center">
      <div>
        <button className="moneyTrans">
          <FaWallet className="font-bold" />
          FUND WALLET
        </button>
      </div>
      <div>
        <button className="moneyTrans">
          <CiBank size={20} className="font-bold" />
          WITHDRAW
        </button>
      </div>
    </div>
  );
};

export default MoneyTransaction;
