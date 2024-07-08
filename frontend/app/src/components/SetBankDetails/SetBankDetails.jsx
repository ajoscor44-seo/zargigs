import React from "react";
import { useAuth } from "../../context/AuthContext";
import FormInput from "../FormInput/FormInput";
import { IoArrowForward } from "react-icons/io5";

const SetBankDetails = ({
  setActivePage,
  setError,
  bankDetails,
  setBankDetails,
  selectedBank,
  setSelectedBank,
}) => {
  const { currentUser } = useAuth();

  // Selects Data
  const banks = [
    "Monicredit Bank",
    "Creditpay Wallet",
    "Opay Digital Services Limited",
    "Palmpay",
    "Moniepoint Microfinance Bank",
    "Kuda Bank",
    "Wema Bank",
    "Access Bank",
    "Ecobank Nigeria",
    "Fidelity Bank",
    "First Bank Of Nigeria",
    "First City Monument Bank (FCMB)",
    "Guaranty Trust Bank (GTB)",
    "Heritage Bank",
    "Jaiz Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Union Bank Of Nigeria",
    "United Bank For Africa (UBA)",
    "Unity Bank",
    "Zenith Bank",
    "VFD Microfinance Bank",
    "Fidelity Mobile",
    "GLobus Bank",
    "Lapo MFB",
  ];

  const handleChange = (e) => {
    return setSelectedBank(e.target.value);
  };

  const handleBankDetailsChange = (e) => {
    return setBankDetails({
      ...bankDetails,
      [e.target.name]: e.target.value,
    });
  };

  const setDetails = () => {
    if (bankDetails.accountNumber && bankDetails.accountName && selectedBank) {
      setError(null);
      setActivePage("birth-religion");
      return;
    }
    if (!selectedBank) {
      return setError("Please select a bank.");
    }
    if (!bankDetails.accountNumber) {
      return setError("Please input your account number");
    }
    if (!bankDetails.accountName) {
      return setError("Please input your account name");
    }
  };

  return (
    <div
      className="font-primary mx-3 mt-10 flex flex-col justify-center mb-20"
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white rounded shadow-2xl">
        <div className="p-3 flex flex-col gap-2">
          <span className="flex justify-between items-center px-3 py-2 border-b text-sm">
            <h2 className="font-bold">For Easy Withdrawals</h2>{" "}
          </span>
          <div className="flex items-center">
            <button
              onClick={() => setActivePage("upload-profile-pic")}
              className="bg-gray-400 flex items-center justify-center gap-1 text-white p-2 w-fit rounded"
            >
              <span>Back</span>
              <span>
                <IoArrowForward />
              </span>
            </button>
          </div>
          <div className="flex flex-col gap-2 py-0">
            <p className="text-center text-xs">
              Cash out your earnings with ease by providing your correct bank
              details in the inputs below. This details provided below is for
              the bank account where you want to accept your earnings
              withdrawals into.
            </p>
          </div>

          <div className="flex flex-col">
            <FormInput
              useSelect={true}
              selections={banks}
              value={selectedBank}
              name={"bankName"}
              handleChange={handleChange}
            />
            <FormInput
              name={"accountNumber"}
              type={"tel"}
              handleChange={handleBankDetailsChange}
              maxLength={10}
              placeholder={"7012345678"}
            />
            <FormInput
              name={"accountName"}
              handleChange={handleBankDetailsChange}
              placeholder={"John Jeremy Doe"}
              note={
                "Enusure the name is the same with the one in your bank details."
              }
            />
          </div>

          <button
            onClick={setDetails}
            className="bg-green-500 text-white font-semibold text-sm py-2 rounded"
          >
            SET BANK DETAILS
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetBankDetails;
