import numeral from "numeral";
import React from "react";
import formatDate from "../../hooks/formatDate";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const TransferHistory = ({ historyData }) => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Mobile-Friendly Transaction Cards List (Visible on mobile/tablet) */}
      <div className="space-y-2.5 block md:hidden">
        {historyData?.map((data, i) => {
          const isSent = data?.senderUsername?.toLowerCase() === currentUser?.username?.toLowerCase();
          return (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSent
                      ? "bg-red-50 text-red-600 border border-red-200/60"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                  }`}
                >
                  {isSent ? <FiArrowUpRight size={16} /> : <FiArrowDownLeft size={16} />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {isSent ? `To @${data.receiverUsername}` : `From @${data.senderUsername}`}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(data.createdAt)}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`text-sm font-black ${
                    isSent ? "text-slate-900" : "text-emerald-600"
                  }`}
                >
                  {isSent ? "-" : "+"}₦{numeral(data.amountSent).format("0,0.00")}
                </div>
                <span
                  className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                    isSent ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isSent ? "Sent" : "Received"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Data Table (Visible on md and up) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4 text-center">Type</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {historyData?.map((data, i) => {
              const isSent = data?.senderUsername?.toLowerCase() === currentUser?.username?.toLowerCase();
              return (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(data.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    <span className={isSent ? "text-red-600 font-bold" : "text-emerald-600 font-bold"}>
                      {isSent ? "-" : "+"}₦{numeral(data.amountSent).format("0,0.00")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800">
                      @{isSent ? data.receiverUsername : data.senderUsername}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isSent
                          ? "bg-red-50 text-red-700 border border-red-200/60"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      }`}
                    >
                      {isSent ? (
                        <>
                          <FiArrowUpRight size={12} /> Sent
                        </>
                      ) : (
                        <>
                          <FiArrowDownLeft size={12} /> Received
                        </>
                      )}
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

export default TransferHistory;
