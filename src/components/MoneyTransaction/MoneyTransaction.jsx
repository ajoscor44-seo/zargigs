import React from "react";
import { FaWallet } from "react-icons/fa6";
import { CiBank } from "react-icons/ci";

const MoneyTransaction = () => {
  return (
    <div className="bg-white px-10 py-3 flex justify-between items-center">
      <div>
        <Link to="fund-wallet">
          <button className="moneyTrans">
            <FaWallet className="font-bold" />
            FUND WALLET
          </button>
        </Link>
      </div>
      <div>
        <Link to="/withdraw">
          <button className="moneyTrans">
            <CiBank size={20} className="font-bold" />
            WITHDRAW
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MoneyTransaction;
