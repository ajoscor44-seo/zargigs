import React, { useEffect, useState } from "react";
import numeral from "numeral";
import { useAuth } from "../../context/AuthContext";
import AutoFunding from "../AutoFunding/AutoFunding";
import { walletService } from "../../services/supabaseService";
import { FaWallet, FaBoltLightning, FaShieldHalved } from "react-icons/fa6";

const FundWallet = () => {
  const [fundings, setFundings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const balance = currentUser?.balance || currentUser?.userEarnings?.balance || 0;
  const walletDetails = currentUser?.walletDetails;

  const getFundings = async () => {
    try {
      setLoading(true);
      const res = await walletService.getFundings(currentUser?.id, page, 10);
      setFundings(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("getFundings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      getFundings();
    }
  }, [page, currentUser?.id]);

  return (
    <div className="font-primary text-slate-800 space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-slate-200/70">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Fund Wallet
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Instantly deposit funds by transferring to your dedicated PocketFi virtual account.
        </p>
      </div>

      {/* Mobile-Only Top Balance Card */}
      <div className="md:hidden">
        <div className="relative rounded-2xl bg-slate-900 p-5 text-white shadow-sm border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800 mb-1.5">
            <FaWallet size={12} /> Available Balance
          </div>
          <div className="text-2xl font-black tracking-tight text-white mt-0.5">
            ₦{numeral(balance).format("0,0.00")}
          </div>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            Instant balance for launching campaigns, posting adverts, and ordering engagement gigs.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Dedicated Automated Virtual Account & History */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs">
            <AutoFunding
              loading={loading}
              fundings={fundings}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </div>

        {/* Right Column (4 cols): Live Balance & PocketFi Protection */}
        <div className="md:col-span-4 space-y-6">
          {/* Desktop Balance Card (Hidden on Mobile) */}
          <div className="hidden md:block relative rounded-2xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800 mb-2">
              <FaWallet size={12} /> Available Balance
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              ₦{numeral(balance).format("0,0.00")}
            </div>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Instant balance for launching campaigns, posting adverts, and ordering engagement gigs.
            </p>
          </div>

          {/* PocketFi Features Card */}
          <div className="p-6 rounded-3xl bg-slate-100/90 border border-slate-200/80 space-y-3.5 text-xs text-slate-600">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-sm">
              <FaShieldHalved className="text-emerald-600" />
              <span>Instant PocketFi Settlement</span>
            </h4>
            <ul className="text-xs leading-relaxed text-slate-600 space-y-2.5 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
                <span><strong>Instant Auto-Credit</strong>: Funds reflect in your wallet within 10 seconds of transfer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
                <span><strong>Zero Approval Delays</strong>: Automated 24/7 processing with zero manual receipt uploads required.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
                <span><strong>Supported Everywhere</strong>: Transfer from any Nigerian banking app or USSD (*737#, *901#, OPay, PalmPay, etc.).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundWallet;
