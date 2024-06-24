import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import numeral from "numeral";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import formatDate from "../hooks/formatDate";
import NoData from "../components/NoData/NoData";
import { FaSpinner } from "react-icons/fa6";

const TransactionHistory = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("order");
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    const withdrawalHistory = await axios.get(
      `/api/v1/withdraw/history/${currentUser.id}`
    );
    if (activeTab !== "order") {
      setHistoryData(withdrawalHistory.data.data);
      return setLoading(false);
    }
    setHistoryData([]);
    return setLoading(false);
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
              activeTab == "order"
                ? "text-center p-2 bg-slate-200 text-sm"
                : "text-center p-2 text-sm"
            }
            onClick={() => setActiveTab("order")}
          >
            Order History
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
          <table className="mb-20">
            <thead>
              <tr>
                <th className="p-3 border text-sm font-bold">S/N</th>
                <th className="p-3 border text-sm font-bold">Date</th>
                <th className="p-3 border text-sm font-bold">Amount</th>
                <th className="p-3 border text-sm font-bold">Recipient</th>
                <th className="p-3 border text-sm font-bold">Status</th>
              </tr>
            </thead>

            <tbody>
              {historyData.map((data, i) => {
                return (
                  <tr>
                    <td className="p-1 border-b text-center text-sm font-normal">
                      {i + 1}.
                    </td>
                    <td className="p-1 border-b text-center text-sm font-normal">
                      {formatDate(data.date)}
                    </td>
                    <td className="p-1 border-b text-center text-sm font-normal">
                      ₦{numeral(data.amount).format("0,0.00")} with ₦
                      {numeral(data.charges).format("0,0.00")} charges
                    </td>
                    <td className="p-1 border-b text-center text-sm font-normal">
                      <span className="grid">
                        <span>{data.bankDetails?.accountNumber}</span>
                        <span>{data.bankDetails?.bankName}</span>
                        <span>{data.bankDetails?.accountName}</span>
                      </span>
                    </td>
                    <td className="p-1 border-b text-center text-sm font-normal">
                      <span
                        className={
                          data.status.toLowerCase() == "approved"
                            ? "bg-green-500 text-white font-semibold p-1 rounded text-xs"
                            : data.status.toLowerCase() === "pending"
                            ? "bg-orange-500 text-white font-semibold p-1 rounded text-xs"
                            : "bg-red-500 text-white font-semibold p-1 rounded text-xs"
                        }
                      >
                        {data.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
