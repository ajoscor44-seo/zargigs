import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const ForgotPassword = () => {
  const { resetId } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const getResetLink = async () => {
    try {
      setError(null);
      if (!email) {
        return setError("Please input your gigsflix email.");
      }
      await axios.post("/forgot-password", { email: email });
      return setMailSent(true);
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
            <p className="text-center text-sm font-semibold text-red-600">
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
              Continue
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
