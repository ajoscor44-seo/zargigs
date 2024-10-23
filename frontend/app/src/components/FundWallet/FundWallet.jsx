import React, { useEffect, useState } from "react";
import BackNav from "../BackNav/BackNav";
import numeral from "numeral";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AutoFunding from "../AutoFunding/AutoFunding";
import ManualFunding from "../ManualFunding/ManualFunding";

const FundWallet = () => {
  const [activeTab, setActiveTab] = useState("automatic");
  const [fundings, setFundings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const balance = currentUser.userEarnings.balance;
  const walletDetails = currentUser.walletDetails;

  const getFundings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/fundings?limit=10&page=${page}`
      );

      setFundings(response.data.data);
      setTotalPages(response.data.meta.pages);
      setError(null);
      return setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFundings();
  }, [page]);

  return (
    <>
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
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          ) : (
            <ManualFunding />
          )}
        </div>
      </div>
    </>
  );
};

export default FundWallet;
