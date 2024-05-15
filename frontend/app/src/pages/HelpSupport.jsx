import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import Disclaimer from "../components/Disclaimer/Disclaimer";
import SupportMsg from "../components/SupportMsg/SupportMsg";
import Supports from "../components/Supports/Supports";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import Chat from "../components/Chat/Chat";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const HelpSupport = () => {
  const { adminData } = useAuth();
  const disclaimerMsg = `Please disregard any social media platform or Facebook Groups posing as ${adminData?.appName}. We do not have any Whatsapp Group or Telegram Group. Beware of Fraudsters posing as ${adminData?.appName} agents or customer supports telling you to pay any amount of money into their personal accounts or into any OPAY/PALMPAY account. We DO NOT have an OPAY/PALMPAY account number.`;
  const [visible, setVisibility] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState({
    complaint: "",
    proof: "",
  });

  const postComplaint = async () => {
    try {
      setIsAdding(true);
      if (!complaint.complaint) {
        setIsAdding(false);
        return setError("Please input a complaint.");
      }

      setError(null);
      const response = await axios.post("/api/v1/admin/complaints", complaint);

      if (response.data.failed) {
        setIsAdding(false);
        return setError(response.data.message);
      }

      setError(null);
      setIsAdding(false);
      return setVisibility(false);
    } catch (error) {
      setIsAdding(false);
      return setError("Oops an error occurred");
    }
  };

  const handleVisibility = () => {
    return setVisibility(!visible);
  };
  return (
    <div className="flex flex-col">
      <BackNav pageName={"Help and Support"} />
      <div className="underBackNav mb-20">
        <Disclaimer disclaimerMsg={disclaimerMsg} />
        <SupportMsg />
        <Supports />
        <Chat handleVisibility={handleVisibility} />
      </div>
      <div className="px-3">
        <div
          className={`bg-dark modal_bg ${
            visible ? "" : "hidden"
          } fixed top-0 left-0 min-h-screen w-screen flex justify-center items-center`}
        >
          <div className="flex flex-col bg-white items-center justify-center p-3 rounded">
            <div
              className="flex items-center gap-10 justify-between"
              style={{ maxWidth: "400px" }}
            >
              <h1 className="font-bold italic">
                Having Any Problem With {adminData?.appName}?
              </h1>
              <span
                disabled={isAdding}
                onClick={handleVisibility}
                className="cursor-pointer border-2 border-white hover:border-gray-200"
              >
                <IoClose size={25} />
              </span>
            </div>

            {error && (
              <p className="font-semibold bg-red-200 w-full text-center py-1 rounded">
                {error}
              </p>
            )}
            <div>
              <p className="text-xs font-bold my-2 text-gray-500">
                Please, input your complaint in the space provided below.
              </p>
              <textarea
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    complaint: e.target.value,
                  })
                }
                placeholder="Input your issue here."
                className="border p-2 border-gray-300 outline-none rounded w-full"
                rows={5}
              ></textarea>
            </div>

            <div className="mt-2 flex justify-end w-full gap-3">
              <button
                disabled={isAdding}
                onClick={handleVisibility}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Close
              </button>
              <button
                disabled={isAdding}
                onClick={postComplaint}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                {isAdding ? (
                  <FaSpinner size="15" variant="white" />
                ) : (
                  "Complain"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default HelpSupport;
