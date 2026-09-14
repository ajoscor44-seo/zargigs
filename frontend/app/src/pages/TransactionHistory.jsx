import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useAuth } from "../context/AuthContext";
import { walletService } from "../services/supabaseService";
import NoData from "../components/NoData/NoData";
import { FaSpinner, FaArrowRight, FaReceipt, FaBolt } from "react-icons/fa6";
import { FiArrowDownLeft, FiRepeat, FiCreditCard } from "react-icons/fi";
import WithdrawalHistory from "../components/WithdrawalHistory/WithdrawalHistory";
import TransferHistory from "../components/TransferHistory/TransferHistory";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom";
import numeral from "numeral";
import formatDate from "../hooks/formatDate";

const TransactionHistory = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "earnings";

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [transactions, setTransactions] = useState([]);

  const userRecordId = currentUser?.id || currentUser?._id;

  const fetchHistory = async () => {
    try {
      if (!userRecordId) {
        setLoading(false);
        return;
      }
      const data = await walletService.getTransactions(userRecordId);
      setTransactions(data || []);
      setLoading(false);
    } catch (error) {
      console.error("fetchHistory error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchHistory();
  }, [userRecordId]);

  const earningList = transactions.filter((tx) => tx.type === "earning");
  const depositList = transactions.filter((tx) => tx.type === "deposit");
  const transferList = transactions.filter((tx) => tx.type === "transfer");
  const withdrawalList = transactions.filter((tx) => tx.type === "withdrawal");

  const currentList =
    activeTab === "earnings"
      ? earningList
      : activeTab === "deposit"
      ? depositList
      : activeTab === "transfer"
      ? transferList
      : withdrawalList;

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Page Header & Tabs */}
        <div className="pb-3 border-b border-slate-200/70 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Transaction History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Complete record of your task earnings, automated deposits, peer transfers, and bank withdrawals.
            </p>
          </div>

          {/* 4-Tab Segmented Control Switcher */}
          <div className="w-full lg:w-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 w-full sm:w-auto">
              <button
                type="button"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  activeTab === "earnings"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
                onClick={() => setActiveTab("earnings")}
              >
                <FaBolt size={12} className={activeTab === "earnings" ? "text-emerald-400" : "text-amber-500"} />
                <span>Earnings</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black leading-none ${
                    activeTab === "earnings"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {earningList.length}
                </span>
              </button>

              <button
                type="button"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  activeTab === "deposit"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
                onClick={() => setActiveTab("deposit")}
              >
                <FiArrowDownLeft size={13} className="shrink-0" />
                <span>Deposits</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black leading-none ${
                    activeTab === "deposit"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {depositList.length}
                </span>
              </button>

              <button
                type="button"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  activeTab === "transfer"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
                onClick={() => setActiveTab("transfer")}
              >
                <FiRepeat size={13} className="shrink-0" />
                <span>Transfers</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black leading-none ${
                    activeTab === "transfer"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {transferList.length}
                </span>
              </button>

              <button
                type="button"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-2 sm:px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  activeTab === "withdraw"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
                onClick={() => setActiveTab("withdraw")}
              >
                <FiCreditCard size={13} className="shrink-0" />
                <span>Withdrawals</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black leading-none ${
                    activeTab === "withdraw"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {withdrawalList.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-xs">
          {loading ? (
            <div className="min-h-[250px] flex flex-col justify-center items-center gap-3">
              <FaSpinner className="text-emerald-500 animate-spin" size={26} />
              <p className="text-xs font-semibold text-slate-400">Loading transaction history...</p>
            </div>
          ) : !currentList.length ? (
            <div className="min-h-[250px] flex justify-center items-center">
              <NoData textBelow={`No ${activeTab} records found`} />
            </div>
          ) : activeTab === "earnings" ? (
            /* Task Earnings View */
            <div className="space-y-4">
              {/* Mobile View */}
              <div className="space-y-2.5 block md:hidden">
                {earningList.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                        <FaBolt size={14} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.title || "Task Reward Earning"}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {formatDate(item.createdAt)} • Ref: {item.reference}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-emerald-600">
                        +₦{numeral(item.amount).format("0,0.00")}
                      </div>
                      <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Data Table */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Reward Amount</th>
                      <th className="py-3 px-4">Task Description</th>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {earningList.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-600 whitespace-nowrap text-sm">
                          +₦{numeral(item.amount).format("0,0.00")}
                        </td>
                        <td className="py-3.5 px-4 text-slate-900 font-bold max-w-xs truncate">
                          {item.title || item.description}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {item.reference || item.id}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Approved & Credited
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                            {item.paymentGateway || "Marketplace"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "deposit" ? (
            /* Deposit History View */
            <div className="space-y-4">
              {/* Mobile View */}
              <div className="space-y-2.5 block md:hidden">
                {depositList.map((item, i) => {
                  const isSuccess =
                    item?.status?.toLowerCase() === "success" ||
                    item?.status?.toLowerCase() === "completed";
                  return (
                    <Link
                      to={`/fundings/${item.id}`}
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors block"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                          <FiArrowDownLeft size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.paymentGateway || "PocketFi"} Deposit
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {formatDate(item.createdAt)} • Ref: {item.reference?.slice(0, 14)}...
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-emerald-600">
                          +₦{numeral(item.amountPaid || item.amount).format("0,0.00")}
                        </div>
                        <span
                          className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                            isSuccess
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Data Table */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Gateway</th>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {depositList.map((item, i) => {
                      const isSuccess =
                        item?.status?.toLowerCase() === "success" ||
                        item?.status?.toLowerCase() === "completed";
                      return (
                        <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600 whitespace-nowrap">
                            +₦{numeral(item.amountPaid || item.amount).format("0,0.00")}
                          </td>
                          <td className="py-3.5 px-4 uppercase text-[11px] font-bold text-slate-800">
                            {item.paymentGateway || "PocketFi"}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {item.reference || item.id}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isSuccess
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/60"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              to={`/fundings/${item.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all"
                            >
                              <FaReceipt size={11} />
                              <span>Receipt</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "transfer" ? (
            <TransferHistory historyData={transferList} />
          ) : (
            <WithdrawalHistory historyData={withdrawalList} />
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default TransactionHistory;
