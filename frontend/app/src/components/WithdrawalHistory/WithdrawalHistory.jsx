import numeral from "numeral";
import React from "react";
import formatDate from "../../hooks/formatDate";
import { FaBuildingColumns } from "react-icons/fa6";

const WithdrawalHistory = ({ historyData }) => {
  return (
    <div>
      {/* Mobile-Friendly Withdrawal Cards List (Visible on mobile/tablet) */}
      <div className="space-y-2.5 block md:hidden">
        {historyData?.map((data, i) => {
          const isApproved = data?.status?.toLowerCase() === "approved" || data?.status?.toLowerCase() === "completed";
          const isPending = data?.status?.toLowerCase() === "pending";

          return (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                  <FaBuildingColumns size={14} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {data.bankDetails?.accountName || "Bank Transfer"}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(data.date || data.createdAt)} • {data.bankDetails?.bankName || "Bank"}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-black text-slate-900">
                  ₦{numeral(data.amount).format("0,0.00")}
                </div>
                <span
                  className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                    isApproved
                      ? "bg-emerald-100 text-emerald-800"
                      : isPending
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {data.status}
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
              <th className="py-3 px-4">Bank Recipient</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {historyData?.map((data, i) => {
              const isApproved = data?.status?.toLowerCase() === "approved" || data?.status?.toLowerCase() === "completed";
              const isPending = data?.status?.toLowerCase() === "pending";

              return (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(data.date || data.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    <div>
                      ₦{numeral(data.amount).format("0,0.00")}
                    </div>
                    {data.charges > 0 && (
                      <div className="text-[10px] text-slate-400 font-normal">
                        Fee: ₦{numeral(data.charges).format("0,0.00")}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">
                      {data.bankDetails?.accountName || "Bank Transfer"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {data.bankDetails?.accountNumber} • {data.bankDetails?.bankName}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : isPending
                          ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                          : "bg-red-50 text-red-700 border border-red-200/60"
                      }`}
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

export default WithdrawalHistory;
