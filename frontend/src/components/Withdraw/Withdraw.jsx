import React, { useState } from "react";
import BackNav from "../BackNav/BackNav";
import ClientMenuBar from "../ClientMenuBar/ClientMenuBar";
import numeral from "numeral";
import { FaEdit, FaLock } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { TfiMenuAlt } from "react-icons/tfi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom/cjs/react-router-dom";
import user from "../../data/user";
import adminData from "../../data/adminData";

const Withdraw = () => {
  const [showPassword, setShowPassword] = useState(false);
  const balance = user.balance;
  const charges = adminData.chargeForWithdrawal;
  const amountWithdrawable = balance - charges;

  return (
    <div>
      <BackNav pageName={"Withdraw"} />
      <div className="underBackNav font-primary">
        <div className="flex justify-between items-center border-b p-2 px-4">
          <span>
            <h2 className="font-bold">Balance:</h2>
            <span className="font-semibold text-sm">
              Max. Withdrawable Amount
            </span>
          </span>
          <span>
            <h2 className="font-bold text-dark">
              ₦{numeral(balance).format("0,0.00")}
            </h2>
            <span className="font-semibold text-primary text-sm">
              ₦{numeral(amountWithdrawable).format("0,0.00")}
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center border-b p-2 px-4">
          <span>
            <p className="text-sm text-primary">Bank Details:</p>
            <h2 className="font-bold">{user.bankDetails.accountName}</h2>
            <span className="font-normal text-sm flex items-center gap-1">
              <span>{user.bankDetails.accountNumber}</span> <CiBank size={15} />{" "}
              <span>{user.bankDetails.bankName}</span>
            </span>
          </span>
          <span>
            <span>
              <FaEdit className="text-primaryLight" size={15} />
            </span>
          </span>
        </div>

        <div className="p-2 px-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span>Amount (₦)</span>
            <div className="flex">
              <span className="border flex justify-center items-center px-3 rounded-s">
                <TfiMenuAlt size={20} className="text-slate-500" />
              </span>
              <input
                type="number"
                className="border outline-none p-3 rounded-e-sm flex-1"
                placeholder="Enter Amount"
              />
            </div>
            <span className="text-xs">
              Please note that a transfer charge will be deducted from your
              account.
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span>Password</span>
            <div className="flex">
              <span className="border flex justify-center items-center px-3 rounded-s">
                <FaLock size={20} className="text-slate-500" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="border border-r-0 outline-none p-3 flex-1"
                placeholder="Enter Password"
              />
              <span className="border border-l-0 flex justify-center items-center px-3 rounded-e">
                {!showPassword ? (
                  <BsEyeFill
                    size={20}
                    className="text-slate-500"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <BsEyeSlashFill
                    size={20}
                    className="text-slate-500"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </span>
            </div>
            <span className="text-xs">
              Please validate this transaction using the password that is
              required when logging in to your account.
            </span>
          </div>

          <div className="flex flex-col mt-2 gap-2">
            <button className="bg-primaryLight py-3 text-xs rounded text-white font-bold hover:bg-opacity-90">
              WITHDRAW
            </button>
            <Link to="/transaction-history">
              <div className="bg-white py-3 text-center cursor-pointer text-xs border rounded hover:opacity-80 transition-colors duration-500">
                WITHDRAWAL HISTORY
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
