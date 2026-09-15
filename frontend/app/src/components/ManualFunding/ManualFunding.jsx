import React, { useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { FaBuilding, FaUser, FaHashtag, FaCopy, FaCheck } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const ManualFunding = () => {
  const { adminData } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyAcct = () => {
    if (adminData?.fundingAccount?.accountNumber) {
      navigator.clipboard.writeText(adminData.fundingAccount.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-800 flex items-center gap-2.5">
        <BiInfoCircle size={20} className="text-emerald-600 flex-shrink-0" />
        <span>Use Manual Funding for amounts under ₦1,000 or if direct transfers are preferred.</span>
      </div>

      {/* Official Admin Funding Card */}
      <div className="rounded-3xl bg-slate-900 p-6 sm:p-7 text-white shadow-sm border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Official DocsZar Settlement Account
          </span>
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-bold">
            Manual Verification
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">Bank Name</span>
            <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FaBuilding size={14} className="text-emerald-400" />
              {adminData?.fundingAccount?.bankName || "Moniepoint MFB"}
            </span>
          </div>

          <div className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1">Account Name</span>
            <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2 truncate">
              <FaUser size={14} className="text-emerald-400 flex-shrink-0" />
              <span className="truncate">{adminData?.fundingAccount?.accountName || "DOCSZAR ENTERPRISE"}</span>
            </span>
          </div>

          <div className="bg-slate-800 rounded-2xl p-3.5 border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1">Account Number</span>
              <span className="text-base sm:text-lg font-black text-emerald-300 font-mono flex items-center gap-1.5">
                <FaHashtag size={14} className="text-emerald-400" />
                {adminData?.fundingAccount?.accountNumber || "8100000000"}
              </span>
            </div>

            <button
              type="button"
              onClick={copyAcct}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              title="Copy Account Number"
            >
              {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Proof Submission Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-emerald-950">
            Made your transfer? Send Proof for Fast Confirmation
          </h4>
          <p className="text-xs text-emerald-700 mt-0.5">
            Send your payment screenshot & username to our 24/7 Verification Desk on WhatsApp.
          </p>
        </div>

        <a
          href="https://wa.me/2349027662488?text=Hello%20DocsZar%20Support%2C%20I%20have%20made%20a%20manual%20transfer%20deposit.%20Here%20is%20my%20proof"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 flex-shrink-0"
        >
          <IoLogoWhatsapp size={18} />
          <span>Confirm on WhatsApp (090 2766 2488)</span>
        </a>
      </div>
    </div>
  );
};

export default ManualFunding;
