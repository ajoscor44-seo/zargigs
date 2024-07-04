import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import tfa_icon from "../../assets/png/twofactor.png";
import { FaArrowLeft } from "react-icons/fa6";
import OtpInput from "../OTPInput/OTPInput";
import { BiSolidCheckCircle } from "react-icons/bi";
import { Link } from "react-router-dom/cjs/react-router-dom";

const VerifyEmail = ({ isLoginPage, setNotVerified }) => {
  const { verifyUserEmail, adminData } = useAuth();
  const [otp, setOtp] = useState(Array(4).fill(""));
  const email = sessionStorage.getItem("auth-user-email");
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState(null);

  const showLoginContent = () => {
    if (isLoginPage) {
      return setNotVerified(false);
    }
    return;
  };

  const verifyEmail = async () => {
    try {
      await verifyUserEmail(email, otp.join(""));

      sessionStorage.removeItem("auth-user-email");
      return setEmailVerified(true);
    } catch (error) {
      setEmailVerified(false);
      sessionStorage.setItem("auth-user-email", email);
      return setError(error.message);
    }
  };

  return (
    <div
      className="underBackNav font-primary mt-5 mx-3 flex flex-col justify-center"
      style={{ maxWidth: "400px" }}
    >
      {emailVerified ? (
        <div className="flex flex-col gap-2 items-center h-96 translate-y-16 bg-white justify-center shadow-2xl rounded">
          <div className="flex justify-center items-center">
            <BiSolidCheckCircle size={100} className="text-green-500" />
          </div>
          <p className="font-bold text-gray-500 text-center">
            Yay, your email has been verified successfully.
          </p>
          <Link to="/login">
            <button
              onClick={showLoginContent}
              className="bg-green-500 px-5 py-2 text-white font-bold rounded mt-5"
            >
              Back to Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow-2xl">
          <span className="flex justify-between items-center px-3 py-2 border-b text-sm">
            <h2 className="font-bold">Welcome to {adminData?.appName}</h2>{" "}
          </span>

          <div className="p-3 flex flex-col gap-2">
            <div className="flex flex-col gap-2 py-4">
              <h1 className="text-center text-xl font-extrabold">
                Verify Your Email Address
              </h1>
              <p className="text-center text-sm">
                To continue using {adminData?.appName}, please verify your email
                address by entering the two factor code sent to your registered
                email address: <span className="font-bold">{email}</span>
              </p>
            </div>
            <p className="text-center font-semibold text-xs text-sky-600 bg-sky-100 p-2 rounded-sm">
              Please check your spam or promotions folder if you cannot find the
              mail in your inbox. You can also click the Resend Button below to
              get the mail again.
            </p>
            {error && (
              <p className="w-full bg-red-200 py-1 rounded text-red-500 font-bold text-sm text-center mb-0">
                {error}
              </p>
            )}
            <div className="flex mb-5 gap-2">
              <img
                className="h-20 object-cover"
                src={tfa_icon}
                alt="Two Factor Icon"
              />

              <div className="flex flex-col gap-2">
                <span>ENTER TWO FACTOR CODE:</span>
                <div className="flex flex-1 gap-2">
                  <OtpInput otp={otp} setOtp={setOtp} error={error} />
                  <button
                    onClick={() => verifyEmail()}
                    className="bg-green-500 px-2 font-semibold text-white text-xs rounded"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="font-semibold text-sm">Didn't receive the mail?</p>
              <p className="text-sm text-green-500 font-semibold cursor-pointer">
                Click to Resend Mail
              </p>
              <p className="font-extrabold">-OR-</p>
              <button className="bg-green-500 py-3 px-5 text-sm text-white rounded flex items-center gap-1">
                <FaArrowLeft />
                <span className="text-xs">CHANGE EMAIL ADDRESS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
