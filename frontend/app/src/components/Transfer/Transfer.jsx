import React, { useState } from "react";
import ToastNotification from "../ToastNotification/ToastNotification";
import BackNav from "../BackNav/BackNav";
import numeral from "numeral";
import { FaLock } from "react-icons/fa";
import { TfiMenuAlt } from "react-icons/tfi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { IoCloseCircle } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";

const Transfer = () => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const { adminData, currentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [amount, setAmount] = useState(false);
  const [receiverUsername, setReceiverUsername] = useState(null);
  const [transferError, setTransferError] = useState(undefined);
  const [makingTransfer, setMakingTransfer] = useState(false);
  const [password, setPassword] = useState(false);
  const balance = currentUser.userEarnings.balance;
  const charges = adminData?.withdrawalCharges;
  const amountTransferable = balance ? balance - charges : 0;

  // Toast Notification
  const showToast = (notificationObj) => {
    setToastNotifications([...toastNotifications, notificationObj]);

    const toastTimeout = setTimeout(() => {
      setToastNotifications([]);
      clearTimeout(toastTimeout);
      return window.location.reload();
    }, 3100);
  };

  const makeTransfer = async () => {
    try {
      if (!amount || !password || !receiverUsername) {
        return setTransferError("Some inputs are yet to be filled.");
      }
      if (Number(balance) - Number(amount) - Number(charges) < 0) {
        return setTransferError("Insufficient balance.");
      }
      const transfer_data = {
        receiver: receiverUsername,
        amount: Number(amount),
        password,
        charges,
      };
      setMakingTransfer(true);
      const response = await axios.post("/api/v1/transfer/make", transfer_data);

      setMakingTransfer(false);
      setTransferError(null);
      return showToast({
        msg: `${response.data.message}`,
        errorType: "success",
      });
    } catch (error) {
      if (error.response.data.failed) {
        setMakingTransfer(false);
        return setTransferError(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <BackNav pageName={"Transfer"} />
      <div
        style={{
          display: transferError ? "block" : "none",
        }}
        onClick={() => setTransferError(null)}
        className="bg-red-50 text-red-500 font-semibold text-center fixed z-10 w-full top-14 border-red-400 border-y-2 flex flex-col"
      >
        <span className="flex justify-end">
          <IoCloseCircle
            size={30}
            className="hover:bg-red-100 rounded-full p-1"
          />
        </span>
        {transferError && <p className="mb-3">{transferError.toString()}</p>}
      </div>
      <div className="underBackNav font-primary">
        <div className="flex justify-between items-center border-b p-2 px-4">
          <span>
            <h2 className="font-bold">Balance:</h2>
            <span className="font-semibold text-sm">
              Max. Transferrable Amount
            </span>
          </span>
          <span>
            <h2 className="font-bold text-dark">
              ₦{numeral(balance).format("0,0.00")}
            </h2>
            <span className="font-semibold text-primary text-sm">
              ₦{numeral(amountTransferable).format("0,0.00")}
            </span>
          </span>
        </div>
        <div className="p-2 px-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <span>Receiver Username</span>
            <div className="flex">
              <span className="border flex justify-center items-center px-3 rounded-s">
                <FaUser size={20} className="text-slate-500" />
              </span>
              <input
                type="text"
                className="border outline-none p-3 rounded-e-sm flex-1"
                placeholder="Enter Username"
                value={receiverUsername}
                onChange={(e) => setReceiverUsername(e.target.value)}
              />
            </div>
            <span className="text-xs text-orange-500 font-semibold">
              Please ENSURE THAT THIS USERNAME IS CORRECT.
            </span>
          </div>

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
            <span className="text-xs font-semibold">
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
            <span className="text-xs font-semibold">
              Please validate this transaction using the password that is
              required when logging in to your account.
            </span>
          </div>

          <div className="flex flex-col mt-2 gap-2">
            <button
              onClick={makeTransfer}
              disabled={makingTransfer}
              className="bg-green-500 py-3 text-xs rounded text-white font-bold hover:bg-opacity-90"
            >
              {makingTransfer ? (
                <Spinner size={25} variant="light" />
              ) : (
                "TRANSFER"
              )}
            </button>
            <Link to="/transaction-history">
              <div
                hidden={makingTransfer}
                className="bg-white py-3 text-center cursor-pointer text-xs border rounded hover:opacity-80 transition-colors duration-500"
              >
                {makingTransfer ? (
                  <Spinner size={25} variant="light" />
                ) : (
                  "TRANSFER HISTORY"
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="toast_cover">
        {toastNotifications?.map((toastNotification) => {
          return (
            <ToastNotification
              key={toastNotification.id}
              toastNotification={toastNotification}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Transfer;
