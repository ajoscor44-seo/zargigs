import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import numeral from "numeral";
import axios from "axios";
import formatDate from "../hooks/formatDate";
import NoData from "../components/NoData/NoData";
import { FaSpinner } from "react-icons/fa6";
import WithdrawalHistory from "../components/WithdrawalHistory/WithdrawalHistory";
import TransferHistory from "../components/TransferHistory/TransferHistory";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("transfer");
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    try {
      const baseUrl =
        activeTab === "transfer" ? "/transfer/history" : "/withdraw/history";
      const history = await axios.get("/api/v1" + baseUrl);
      setHistoryData(history.data.data);
      return setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchHistory();
  }, [activeTab]);

  return (
    <div>
      <BackNav pageName={"My Transactions"} />
      <div className="underBackNav font-primary flex flex-col">
        <div className="grid grid-cols-2 border">
          <div
            className={
              activeTab == "transfer"
                ? "text-center p-2 bg-slate-200 text-sm"
                : "text-center p-2 text-sm"
            }
            onClick={() => setActiveTab("transfer")}
          >
            Transfer History
          </div>
          <div
            className={
              activeTab == "withdraw"
                ? "text-center p-2 bg-slate-200 text-sm"
                : "text-center p-2 text-sm"
            }
            onClick={() => setActiveTab("withdraw")}
          >
            Withdrawal History
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <FaSpinner color="green" size={25} />
          </div>
        ) : historyData.length && !loading ? (
          activeTab === "transfer" ? (
            <TransferHistory historyData={historyData} />
          ) : (
            <WithdrawalHistory historyData={historyData} />
          )
        ) : (
          <div className="flex justify-center items-center min-h-96">
            <NoData textBelow={"No history found"} />
          </div>
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default TransactionHistory;
