import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import numeral from "numeral";

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("order");
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    setHistoryData([
      {
        sn: 1,
        date: "Oct 30th 2022 2:50 pm",
        amount: 100,
        charges: 10,
        recipient: "Guaranty",
        status: "Pending",
      },
      {
        sn: 2,
        date: "Oct 30th 2022 2:50 pm",
        amount: 100,
        charges: 10,
        recipient: "Guaranty",
        status: "Approved",
      },
      {
        sn: 3,
        date: "Oct 30th 2022 2:50 pm",
        amount: 100,
        charges: 10,
        recipient: "Guaranty",
        status: "Declined",
      },
      {
        sn: 4,
        date: "Oct 30th 2022 2:50 pm",
        amount: 100,
        charges: 10,
        recipient: "Guaranty",
        status: "Approved",
      },
      {
        sn: 5,
        date: "Oct 30th 2022 2:50 pm",
        amount: 100,
        charges: 10,
        recipient: "Guaranty",
        status: "Approved",
      },
    ]);
  };

  useEffect(() => {
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
            {historyData.map((data) => {
              return (
                <tr>
                  <td className="p-1 border-b text-center text-sm font-normal">
                    {data.sn}.
                  </td>
                  <td className="p-1 border-b text-center text-sm font-normal">
                    {data.date}
                  </td>
                  <td className="p-1 border-b text-center text-sm font-normal">
                    ₦{numeral(data.amount).format("0,0.00")} with ₦
                    {numeral(data.charges).format("0,0.00")} charges
                  </td>
                  <td className="p-1 border-b text-center text-sm font-normal">
                    {data.recipient}
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
      </div>
    </div>
  );
};

export default TransactionHistory;
