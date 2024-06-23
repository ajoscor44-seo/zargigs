import React, { useState } from "react";
import BackNav from "../BackNav/BackNav";
import numeral from "numeral";
import { FaEdit, FaLock } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { TfiMenuAlt } from "react-icons/tfi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { IoCloseCircle } from "react-icons/io5";

const Withdraw = () => {
  const history = useHistory();
  const { adminData, currentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [amount, setAmount] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(undefined);
  const [makingWithdrawal, setMakingWithdrawal] = useState(false);
  const [password, setPassword] = useState(false);
  const balance = currentUser.userEarnings.balance;
  const charges = adminData.withdrawalCharges;
  const amountWithdrawable = balance ? balance - charges : 0;

  const makeWithdrawal = async () => {
    try {
      if (!amount || !password) {
        return setWithdrawalError("Some inputs are yet to be filled.");
      }
      if (Number(balance) - Number(amount) - Number(charges) < 0) {
        return setWithdrawalError("Insufficient balance.");
      }
      const withdrawal_data = {
        id: currentUser?.id,
        withdrawalAmount: Number(amount),
        charges,
        password,
      };
      setMakingWithdrawal(true);
      await axios.post("/api/v1/withdraw/request", withdrawal_data);

      setMakingWithdrawal(false);
      setWithdrawalError(null);
      return window.location.reload();
    } catch (error) {
      if (error.response.data.failed) {
        setMakingWithdrawal(false);
        return setWithdrawalError(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <BackNav pageName={"Withdraw"} />
      <div
        style={{
          display: withdrawalError ? "block" : "none",
        }}
        onClick={() => setWithdrawalError(null)}
        className="bg-red-50 text-red-500 font-semibold text-center fixed z-10 w-full top-14 border-red-400 border-y-2 flex flex-col"
      >
        <span className="flex justify-end">
          <IoCloseCircle
            size={30}
            className="hover:bg-red-100 rounded-full p-1"
          />
        </span>
        {withdrawalError && (
          <p className="mb-3">{withdrawalError.toString()}</p>
        )}
      </div>
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
            <h2 className="font-bold">
              {currentUser.bankDetails.accountName || "No account name"}
            </h2>
            <span className="font-normal text-sm flex items-center gap-1">
              <span>
                {currentUser.bankDetails.accountNumber || "No account no."}
              </span>{" "}
              <CiBank size={15} />{" "}
              <span>{currentUser.bankDetails.bankName || "No bank name"}</span>
            </span>
          </span>
          <span>
            <span>
              <FaEdit className="text-green-500" size={15} />
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
            <button
              onClick={makeWithdrawal}
              disabled={makingWithdrawal}
              className="bg-green-500 py-3 text-xs rounded text-white font-bold hover:bg-opacity-90"
            >
              {makingWithdrawal ? (
                <Spinner size={25} variant="light" />
              ) : (
                "WITHDRAW"
              )}
            </button>
            <Link to="/transaction-history">
              <div
                hidden={makingWithdrawal}
                className="bg-white py-3 text-center cursor-pointer text-xs border rounded hover:opacity-80 transition-colors duration-500"
              >
                {makingWithdrawal ? (
                  <Spinner size={25} variant="light" />
                ) : (
                  "WITHDRAWAL HISTORY"
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
