import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaCopy,
  FaCheck,
  FaBuilding,
  FaUser,
  FaHashtag,
  FaChevronLeft,
  FaChevronRight,
  FaBoltLightning,
  FaShieldHalved,
  FaWallet,
} from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import NoData from "../NoData/NoData";
import numeral from "numeral";
import formatDate from "../../hooks/formatDate";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../config/supabase.config";
import { walletService } from "../../services/supabaseService";
import axios from "axios";

const AutoFunding = ({
  loading,
  fundings,
  totalPages,
  page,
  setPage,
}) => {
  const { currentUser, fetchUserData } = useAuth();
  const history = useHistory();
  const [copiedField, setCopiedField] = useState(null);
  const [virtualAccount, setVirtualAccount] = useState(null);
  const [generatingVA, setGeneratingVA] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [genError, setGenError] = useState(null);

  useEffect(() => {
    const uId = currentUser?.id;
    if (!uId) {
      setVirtualAccount(null);
      return;
    }

    // 1. Instant local load if exists for this specific user
    try {
      const cached = localStorage.getItem(`docszar_pocketfi_va_${uId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.accountNumber && parsed?.accountNumber !== "8103460237") {
          setVirtualAccount(parsed);
        }
      }
    } catch {
      // ignore
    }

    // 2. Fetch fresh from backend & Supabase
    fetchExistingVirtualAccount(uId);
  }, [currentUser?.id]);

  const fetchExistingVirtualAccount = async (targetUserId) => {
    const uId = targetUserId || currentUser?.id;
    if (!uId) return;

    try {
      // Direct load via serverless Supabase Edge Function & DB
      const supaAccount = await walletService.getVirtualAccount(uId);
      if (supaAccount?.accountNumber) {
        setVirtualAccount(supaAccount);
        localStorage.setItem(`docszar_pocketfi_va_${uId}`, JSON.stringify(supaAccount));
        return;
      }

      // If no virtual account exists yet
      setVirtualAccount(null);
      localStorage.removeItem(`docszar_pocketfi_va_${uId}`);
    } catch (err) {
      console.warn("fetchExistingVirtualAccount error:", err);
    }
  };

  const handleGenerateAccount = async (force = true) => {
    const isForce = typeof force === "boolean" ? force : true;
    setGeneratingVA(true);
    setGenError(null);
    try {
      const uId = currentUser?.id;
      if (!uId) {
        throw new Error("You must be logged in to generate a virtual account.");
      }

      const payload = {
        userId: uId,
        firstname: currentUser?.firstname || currentUser?.first_name || currentUser?.username || "DocsZAR",
        lastname: currentUser?.lastname || currentUser?.last_name || "Earner",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        forceNew: isForce,
      };

      // 100% Serverless generation via Supabase Edge Function
      const generatedDetails = await walletService.generateVirtualAccount(payload);

      if (generatedDetails?.accountNumber) {
        setVirtualAccount(generatedDetails);
        localStorage.setItem(
          `docszar_pocketfi_va_${uId}`,
          JSON.stringify(generatedDetails)
        );
        await fetchUserData();
      } else {
        setGenError("Could not generate PocketFi virtual account.");
      }
    } catch (err) {
      console.error("handleGenerateAccount error:", err);
      setGenError(
        err.message ||
        "PocketFi API Error: Unable to provision virtual account. Please check details."
      );
    } finally {
      setGeneratingVA(false);
    }
  };

  const handleRefreshBalance = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchExistingVirtualAccount();
    setTimeout(() => setRefreshing(false), 800);
  };

  const copyToClip = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="space-y-6 font-primary">
      {!virtualAccount?.accountNumber ? (
        /* Call To Action: Generate Dedicated Virtual Account */
        <div className="rounded-2xl bg-slate-900 p-5 sm:p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 max-w-lg text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-700">
              <FaBoltLightning size={20} />
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                PocketFi Dedicated Virtual Account
              </h2>
              <p className="text-xs text-slate-300 leading-snug mt-0.5">
                Get an instant Nigerian bank account. Any transfer credits your wallet automatically in seconds.
              </p>
            </div>
          </div>

          {genError && (
            <div className="w-full sm:w-auto p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold text-center">
              {genError}
            </div>
          )}

          <div className="shrink-0 w-full sm:w-auto flex flex-col items-center sm:items-end gap-1.5">
            <button
              type="button"
              onClick={() => handleGenerateAccount(true)}
              disabled={generatingVA}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {generatingVA ? (
                <>
                  <FaSpinner className="animate-spin text-white" size={15} />
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <FaBoltLightning size={14} />
                  <span>Generate Virtual Account</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-slate-400 font-medium">
              ⚡ Instant 24/7 Automated Credit
            </span>
          </div>
        </div>
      ) : (
        /* Active Virtual Account Display Card */
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-3.5 sm:p-5 text-white shadow-md border border-slate-800 space-y-2.5">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-400 truncate">
                Virtual Account (PocketFi)
              </span>
            </div>
            <button
              type="button"
              onClick={handleRefreshBalance}
              className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} size={10} />
              <span>{refreshing ? "Checking..." : "Check Balance"}</span>
            </button>
          </div>

          {/* Account Number Hero Card */}
          <div className="bg-slate-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-slate-700 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Account Number
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-300 font-mono tracking-wider flex items-center gap-1">
                <FaHashtag size={11} className="text-emerald-400 shrink-0" />
                <span>{virtualAccount?.accountNumber}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => copyToClip(virtualAccount?.accountNumber, "acct")}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 ml-2"
              title="Copy Account Number"
            >
              {copiedField === "acct" ? (
                <>
                  <FaCheck size={11} />
                  <span className="text-[10px] font-black">Copied!</span>
                </>
              ) : (
                <>
                  <FaCopy size={11} />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Bank & Account Name Row (2 columns) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Bank Name */}
            <div className="bg-slate-800/70 rounded-xl p-2 sm:p-2.5 border border-slate-700/60 min-w-0">
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">
                Bank Name
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5 truncate uppercase">
                <FaBuilding size={10} className="text-emerald-400 shrink-0" />
                <span className="truncate">{virtualAccount?.bankName || "PAGA"}</span>
              </span>
            </div>

            {/* Account Name */}
            <div className="bg-slate-800/70 rounded-xl p-2 sm:p-2.5 border border-slate-700/60 min-w-0">
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">
                Account Name
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5 truncate">
                <FaUser size={10} className="text-emerald-400 shrink-0" />
                <span className="truncate">{virtualAccount?.accountName}</span>
              </span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="pt-2 border-t border-white/10 flex items-start sm:items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-200/90 leading-snug font-medium">
            <FaBoltLightning className="text-amber-400 shrink-0 mt-0.5 sm:mt-0" size={10} />
            <span>
              Transfer from any bank (OPay, PalmPay, Kuda, GTB, Zenith, etc.). Credits automatically in seconds!
            </span>
          </div>
        </div>
      )}

      {/* Funding History Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            Recent Automated Deposits
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <FaChevronLeft size={12} />
            </button>
            <span className="text-xs font-bold text-emerald-600 px-2">
              {page} / {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col justify-center items-center gap-2">
            <FaSpinner size={24} className="text-emerald-500 animate-spin" />
            <span className="text-xs text-slate-400">Loading records...</span>
          </div>
        ) : !fundings?.length ? (
          <div className="h-48 flex justify-center items-center bg-slate-50/50 rounded-2xl border border-slate-100">
            <NoData textBelow="No automatic funding history found yet" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {fundings.map((funding, i) => {
                  const isSuccess =
                    funding?.status?.toLowerCase() === "success" ||
                    funding?.status?.toLowerCase() === "completed";
                  return (
                    <tr
                      key={i}
                      onClick={() => history.push(`/fundings/${funding.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(funding.createdAt || funding.created_at)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₦{numeral(funding.amountPaid || funding.amount).format("0,0.00")}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[11px] text-slate-500 font-semibold">
                        {funding.paymentGateway || "PocketFi"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isSuccess
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          {funding.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoFunding;
