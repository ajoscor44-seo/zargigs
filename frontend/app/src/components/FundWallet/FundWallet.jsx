import React, { useEffect, useState } from "react";
import BackNav from "../BackNav/BackNav";
import numeral from "numeral";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { BiInfoCircle } from "react-icons/bi";
import NoData from "../NoData/NoData";
import { FaSpinner } from "react-icons/fa6";
import formatDate from "../../hooks/formatDate";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import AutoFunding from "../AutoFunding/AutoFunding";
import ManualFunding from "../ManualFunding/ManualFunding";
// import ToastNotification from "../ToastNotification/ToastNotification";

const FundWallet = () => {
  const [activeTab, setActiveTab] = useState("automatic");
  const [fundings, setFundings] = useState([]);
  const [meta, setMeta] = useState({});
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const balance = currentUser.userEarnings.balance;
  const walletDetails = currentUser.walletDetails;
  const history = useHistory();

  const getFundings = async () => {
    try {
      const response = await axios.get(
        `/api/v1/fundings?limit=${limit}&page=${1}`
      );

      setFundings(response.data.data);
      setMeta(response.data.meta);
      setError(null);
      return setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFundings();
  }, []);

  return (
    <div>
      <BackNav pageName={"Fund Wallet"} />
      <div className="underBackNav h-fit mb-16">
        <div className="flex justify-between items-center px-3 py-1 text-center bg-green-200">
          <h2 className="font-bold">Balance:</h2>
          <h2 className="font-bold">₦{numeral(balance).format("0,0.00")}</h2>
        </div>
        <div className="grid grid-cols-2">
          <div
            className={
              activeTab === "automatic"
                ? "bg-gray-200 text-center py-1"
                : "text-center py-1"
            }
            onClick={() => setActiveTab("automatic")}
          >
            Automatic Funding
          </div>
          <div
            className={
              activeTab === "manual"
                ? "bg-gray-200 text-center py-1"
                : "text-center py-1"
            }
            onClick={() => setActiveTab("manual")}
          >
            Manual Funding
          </div>
        </div>
        <div className="border">
          {activeTab === "automatic" ? (
            <AutoFunding
              walletDetails={walletDetails}
              loading={loading}
              fundings={fundings}
            />
          ) : (
            <ManualFunding />
          )}
        </div>
      </div>
    </div>
  );
};

export default FundWallet;
