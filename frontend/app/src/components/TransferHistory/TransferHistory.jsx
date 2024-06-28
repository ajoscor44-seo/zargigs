import numeral from "numeral";
import React from "react";
import formatDate from "../../hooks/formatDate";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const TransferHistory = ({ historyData }) => {
  const { currentUser } = useAuth();

  return (
    <table className="mb-20">
      <thead>
        <tr>
          <th className="p-3 border text-sm font-bold">S/N</th>
          <th className="p-3 border text-sm font-bold">Date</th>
          <th className="p-3 border text-sm font-bold">Amount</th>
          <th className="p-3 border text-sm font-bold">Participant</th>
          <th className="p-3 border text-sm font-bold">Direction</th>
        </tr>
      </thead>

      <tbody>
        {historyData.map((data, i) => {
          return (
            <tr key={i}>
              <td className="p-0.5 border-b text-center text-sm font-normal">
                {i + 1}.
              </td>
              <td className="p-0.5 border-b text-center text-sm font-normal">
                {formatDate(data.createdAt)}
              </td>
              <td className="p-0.5 border-b text-center text-sm font-normal">
                ₦{numeral(data.amountSent).format("0,0.00")}
              </td>
              <td className="p-0.5 border-b text-center text-sm font-normal">
                {data.senderUsername === currentUser.username
                  ? data.receiverUsername
                  : data.senderUsername}
              </td>
              <td className="p-0.5 border-b text-center text-sm font-normal">
                <span
                  className={
                    data?.senderUsername?.toLowerCase() == currentUser.username
                      ? "text-red-500 font-semibold flex justify-center items-center"
                      : "text-green-500 font-semibold flex justify-center items-center"
                  }
                >
                  {data?.senderUsername?.toLowerCase() ===
                  currentUser.username ? (
                    <FiArrowUpRight size={30} />
                  ) : (
                    <FiArrowDownLeft size={30} />
                  )}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransferHistory;
