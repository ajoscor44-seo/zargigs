import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { streakService } from "../../services/supabaseService";
import { triggerConfetti } from "../../utils/confetti";
import { FaFire, FaGift, FaCheck, FaCrown, FaClock, FaSpinner } from "react-icons/fa6";
import numeral from "numeral";

const DailyStreakCard = () => {
  const { currentUser, fetchUserData } = useAuth();
  const [streakStatus, setStreakStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const rewards = streakService.getRewardsList();

  const loadStreak = async () => {
    if (!currentUser?.id && !currentUser?._id) return;
    try {
      const status = await streakService.getStreakStatus(currentUser?.id || currentUser?._id);
      setStreakStatus(status);
    } catch (err) {
      console.warn("Streak load error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreak();
  }, [currentUser?.id, currentUser?._id]);

  // Countdown timer to next calendar midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;

      if (diffMs <= 0) {
        setTimeLeft("Ready to claim!");
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(`${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async () => {
    const userId = currentUser?.id || currentUser?._id;
    if (!userId || claiming) return;

    try {
      setClaiming(true);
      const res = await streakService.claimDailyStreak(userId);
      triggerConfetti();
      setSuccessMsg(`🎉 Claimed ₦${res.reward}.00! Your Day ${res.day} bonus was added to your wallet.`);
      await fetchUserData();
      await loadStreak();
    } catch (err) {
      console.warn("Claim streak error:", err.message);
    } finally {
      setClaiming(false);
    }
  };

  if (loading || !streakStatus) {
    return null;
  }

  const currentStreak = streakStatus.currentStreak || 0;
  const canClaim = streakStatus.canClaimToday;
  const targetDay = streakStatus.nextDayNumber || 1;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-emerald-950/20 border border-emerald-900/40 relative overflow-hidden font-primary">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
            <FaFire size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Daily Login Streak
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {currentStreak} Day{currentStreak === 1 ? "" : "s"} Streak 🔥
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300">
              Check in daily to build your streak & unlock the Day 7 Mega Bonus!
            </p>
          </div>
        </div>

        {/* Claim Action Button / Status Timer */}
        <div className="shrink-0">
          {canClaim ? (
            <button
              type="button"
              onClick={handleClaim}
              disabled={claiming}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {claiming ? (
                <>
                  <FaSpinner className="animate-spin" size={14} />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <FaGift size={14} />
                  <span>Claim Day {targetDay} Reward (₦{rewards[targetDay - 1]?.reward})</span>
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-slate-300">
              <FaClock size={12} className="text-emerald-400" />
              <span>Next reward in: <strong className="font-mono text-emerald-300">{timeLeft}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 animate-bounce">
          <span>{successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 7-Day Rewards Track */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 pt-4 relative z-10">
        {rewards.map((r) => {
          const isPastClaimed = !canClaim ? r.day <= currentStreak : r.day < targetDay;
          const isCurrentTarget = canClaim && r.day === targetDay;
          const isMega = r.isMega;

          return (
            <div
              key={r.day}
              className={`rounded-2xl p-2 sm:p-3 text-center transition-all flex flex-col items-center justify-between gap-1 relative ${
                isCurrentTarget
                  ? "bg-gradient-to-b from-emerald-500/30 to-teal-500/20 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105"
                  : isPastClaimed
                  ? "bg-emerald-950/40 border border-emerald-700/40 text-slate-300"
                  : isMega
                  ? "bg-amber-950/30 border border-amber-500/40 text-amber-200"
                  : "bg-white/5 border border-white/10 text-slate-400"
              }`}
            >
              {/* Day Label */}
              <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">
                {r.label}
              </span>

              {/* Icon / Status */}
              <div className="my-0.5">
                {isPastClaimed ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-xs">
                    <FaCheck size={11} />
                  </div>
                ) : isCurrentTarget ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center mx-auto animate-pulse">
                    <FaGift size={12} />
                  </div>
                ) : isMega ? (
                  <div className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center mx-auto">
                    <FaCrown size={12} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/10 text-slate-400 flex items-center justify-center mx-auto text-[11px] font-bold">
                    🎁
                  </div>
                )}
              </div>

              {/* Reward Amount */}
              <span
                className={`text-[11px] sm:text-xs font-black font-mono leading-none ${
                  isCurrentTarget
                    ? "text-emerald-300"
                    : isMega
                    ? "text-amber-300"
                    : isPastClaimed
                    ? "text-emerald-400"
                    : "text-slate-300"
                }`}
              >
                ₦{numeral(r.reward).format("0,0")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyStreakCard;
