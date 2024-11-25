import React, { useState } from "react";
import FormInput from "../FormInput/FormInput";
import { FaSpinner } from "react-icons/fa6";
import axios from "axios";

const NINNumberInput = () => {
  const [nin, setNin] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateWallet = async () => {
    try {
      if (!nin) {
        setError("Please input a valid NIN number");
        return;
      }
      if (nin.length !== 11) {
        setError("NIN number must be 11 digits");
        return;
      }
      setLoading(true);

      const response = await axios.post(
        `/api/v1/user/generate-wallet?nin=${nin}`
      );

      setError("");
      setLoading(false);
      return window.location.reload();
    } catch (error) {
      setLoading(false);
      return setError(error.response.data.message);
    }
  };

  const handleNin = (e) => {
    setNin(e.target.value);
  };

  return (
    <div className="min-h-[72vh] flex flex-col gap-3 text-center items-center px-4 py-5  text-primary">
      <h2 className="text-lg font-semibold mt-5">Generate A Personal Wallet</h2>
      <p className="text-sm text-black">
        Please input your valid NIN number to generate a personal wallet for
        your account.
      </p>
      {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
      <FormInput
        placeholder={"1234567890"}
        label={"Input your valid NIN number"}
        handleChange={handleNin}
        errorMsg={error}
        setError={setError}
      />
      <button
        onClick={generateWallet}
        className="border border-primary px-3.5 py-1.5 my-1.4 rounded"
      >
        {loading ? <FaSpinner size={12} /> : "Generate Wallet"}
      </button>

      <p className="text-xs bg-orange-100 text-orange-600 px-3 py-1.5 my-2 rounded-full">
        You can choose to continue using manual funding.
      </p>

      <p className="text-xs text-gray-400">
        By generating a wallet, you agree to our Terms and Conditions.
      </p>
    </div>
  );
};

export default NINNumberInput;
