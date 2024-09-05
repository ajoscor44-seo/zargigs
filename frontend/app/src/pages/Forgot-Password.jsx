import React, { useState } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { BiCheckCircle } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa6";

const ForgotPassword = () => {
  const { resetId } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const getResetLink = async () => {
    try {
      setError(null);
      setLoading(true);
      if (!email) {
        return setError("Please input your gigsflix email.");
      }
      localStorage.setItem("reset-email", email);
      await axios.post("/api/v1/forgot-password", { email: email });
      setLoading(false);
      return setSuccessMessage(
        "A password reset link has been sent to your mail."
      );
    } catch (error) {
      return setError(error.response.data.message || error.message);
    }
  };

  const resetPassword = async () => {
    try {
      setError(null);
      setLoading(true);
      if (!password) {
        return setError("Please input your new password.");
      }

      await axios.post("/api/v1/reset-password", {
        email: localStorage.getItem("reset-email"),
        resetId,
      });
      setSuccessMessage("Your password has been reset successfully");
      setLoading(false);
      return history.push("/login");
    } catch (error) {
      return setError(error.response.data.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center border min-h-screen py-10">
      {resetId ? (
        <div className="flex flex-col shadow mx-5 p-3 border rounded bg-white">
          <h2>Forgot Password</h2>
          <p>Input your new password into the field below.</p>
          <div className="flex flex-col">
            <span className="text-green-500 text-lg mb-1 font-primary font-medium">
              Password:
            </span>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded outline-green-500"
            />
            <button
              disabled={loading}
              onClick={resetPassword}
              className="px-2 py-1 text-center font-semibold bg-green-500 text-white mt-2 rounded"
            >
              {loading ? <FaSpinner className="w-8 h-8" /> : "Reset Password"}
            </button>
            <p className="text-center text-sm font-semibold text-red-600">
              {error}
            </p>
          </div>
        </div>
      ) : successMessage ? (
        <div className="flex flex-col shadow mx-5 p-3 border rounded bg-white">
          <div className="flex flex-col justify-center items-center">
            <span className="text-green-500 my-1">
              <BiCheckCircle className="w-64 h-64" />
            </span>
            <p className="text-center font-semibold text-green-500 mt-2">
              {successMessage}
            </p>
            <p className="text-center text-sm font-semibold text-red-600 mt-2">
              {error}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col shadow mx-5 p-3 border rounded bg-white">
          <h2 className="text-lg font-bold">Forgot Password</h2>
          <p className="text-md">
            Input your email address into the field below.
          </p>
          <div className="flex flex-col">
            <span className="text-green-500 text-md my-1 font-primary font-medium">
              Email:
            </span>
            <input
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded outline-green-500"
            />
            <button
              onClick={getResetLink}
              className="px-2 py-1 text-center font-semibold bg-green-500 text-white mt-2 rounded"
            >
              {loading ? <FaSpinner className="w-8 h-8" /> : "Continue"}
            </button>
            <p className="text-center text-sm font-semibold text-red-600 mt-2">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
