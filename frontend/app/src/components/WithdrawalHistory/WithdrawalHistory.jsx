import numeral from "numeral";
import React from "react";
import formatDate from "../../hooks/formatDate";

const WithdrawalHistory = ({ historyData }) => {
  return (
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
            <tr key={i}>
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
  );
};

export default WithdrawalHistory;
