import React from "react";
import { FaMoneyBillTransfer, FaWallet } from "react-icons/fa6";
import { CiBank } from "react-icons/ci";
import { Link } from "react-router-dom/cjs/react-router-dom";

const MoneyTransaction = () => {
  return (
    <div className="bg-white px-4 py-3 flex justify-between items-center">
      <div>
        <Link to="/fund-wallet">
          <button className="moneyTrans">
            <FaWallet className="font-bold" />
            FUND
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
      <div>
        <Link to="/transfer">
          <button className="moneyTrans">
            <FaMoneyBillTransfer className="font-bold" />
            TRANSFER
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MoneyTransaction;
