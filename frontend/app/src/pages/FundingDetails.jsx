import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useParams, Link } from "react-router-dom/cjs/react-router-dom";
import { FaSpinner, FaCheckCircle, FaExclamationCircle, FaCopy, FaCheck } from "react-icons/fa";
import { supabase } from "../config/supabase.config";
import numeral from "numeral";
import formatDate from "../hooks/formatDate";

const FundingDetails = () => {
  const { id } = useParams();
  const [fundingDetails, setFundingDetails] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedRef, setCopiedRef] = useState(false);

  const copyRefToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const fetchFundingDetails = async () => {
    try {
      setLoading(true);
      // Query Supabase directly
      const { data, error: supaErr } = await supabase
        .from("funding")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (supaErr || !data) {
        // Fallback: try by reference
        const { data: byRef } = await supabase
          .from("funding")
          .select("*")
          .eq("reference", id)
          .maybeSingle();

        if (byRef) {
          setFundingDetails({
            id: byRef.id,
            amountPaid: byRef.amount,
            status: byRef.status,
            paymentGateway: byRef.payment_method || "PocketFi",
            paymentReference: byRef.reference,
            createdAt: byRef.created_at,
          });
          setLoading(false);
          return;
        }

        throw new Error("Transaction record not found");
      }

      setFundingDetails({
        id: data.id,
        amountPaid: data.amount,
        status: data.status,
        paymentGateway: data.payment_method || "PocketFi",
        paymentReference: data.reference,
        createdAt: data.created_at,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load transaction receipt");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingDetails();
  }, [id]);

  const isSuccess =
    fundingDetails?.status?.toLowerCase() === "success" ||
    fundingDetails?.status?.toLowerCase() === "completed";

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        <div className="pb-2 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Deposit Transaction Receipt
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Official transaction confirmation and gateway settlement breakdown.
            </p>
          </div>
          <Link
            to="/fund-wallet"
            className="self-start px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            ← Back to Wallet
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center gap-3 bg-white rounded-3xl border border-slate-200/80">
            <FaSpinner className="text-emerald-500 animate-spin" size={28} />
            <p className="text-xs font-semibold text-slate-400">Loading receipt details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-3xl p-6 text-center text-xs font-bold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Full Receipt Breakdown */}
            <div className="md:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="text-center pb-4 border-b border-slate-100">
                  <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-3 ${
                    isSuccess
                      ? "bg-emerald-50 text-emerald-600 shadow-emerald-500/10"
                      : "bg-amber-50 text-amber-600 shadow-amber-500/10"
                  }`}>
                    {isSuccess ? <FaCheckCircle size={32} /> : <FaExclamationCircle size={32} />}
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Wallet Deposit Amount
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 mt-1">
                    ₦{numeral(fundingDetails?.amountPaid || 0).format("0,0.00")}
                  </h2>

                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {fundingDetails?.status || "SUCCESS"}
                  </div>
                </div>

                {/* Receipt Details Breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-semibold shrink-0">Sender Account:</span>
                    <span className="font-bold text-slate-800 text-right truncate">{fundingDetails?.sourceAccountName || "Direct Bank Transfer"}</span>
                  </div>

                  {fundingDetails?.sourceAccountNumber && (
                    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                      <span className="text-slate-400 font-semibold shrink-0">Sender Account No:</span>
                      <span className="font-bold text-slate-800 font-mono text-right">{fundingDetails.sourceAccountNumber}</span>
                    </div>
                  )}

                  {fundingDetails?.sourceBankName && (
                    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                      <span className="text-slate-400 font-semibold shrink-0">Sender Bank:</span>
                      <span className="font-bold text-slate-800 text-right">{fundingDetails.sourceBankName}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-semibold shrink-0">Payment Gateway:</span>
                    <span className="font-bold text-slate-800 uppercase text-right">{fundingDetails?.paymentGateway || "PocketFi"}</span>
                  </div>

                  <div className="py-2 border-b border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Reference ID:</span>
                      <button
                        type="button"
                        onClick={() => copyRefToClipboard(fundingDetails?.paymentReference || id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        {copiedRef ? (
                          <>
                            <FaCheck size={10} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <FaCopy size={10} />
                            <span>Copy Ref</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200/80 break-all select-all font-medium leading-relaxed">
                      {fundingDetails?.paymentReference || id}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-semibold shrink-0">Date Paid:</span>
                    <span className="font-bold text-slate-800 text-right">
                      {formatDate(fundingDetails?.paidOn || fundingDetails?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Actions & Security */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Transaction Summary
                </h3>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2 text-xs text-emerald-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Instant Balance Credit</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    This deposit has been successfully credited to your wallet balance. You can immediately use it for tasks or campaign promotions.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Link
                    to="/fund-wallet"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center transition-colors shadow-sm"
                  >
                    Deposit More Funds
                  </Link>

                  <Link
                    to="/transaction-history"
                    className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors"
                  >
                    View All Transactions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default FundingDetails;
