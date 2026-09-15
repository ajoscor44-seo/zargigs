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
        setTimeLeft("Ready!");
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
      setSuccessMsg(`🎉 Claimed ₦${res.reward}.00! Added to your wallet.`);
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
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-3.5 text-white shadow-md border border-emerald-950/60 relative overflow-hidden font-primary">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative z-10 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
            <FaFire size={14} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-black tracking-tight text-white">
                Daily Login Bonus
              </h3>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {currentStreak} Day{currentStreak === 1 ? "" : "s"} Streak
              </span>
            </div>
          </div>
        </div>

        {/* Claim Action Button / Status Timer */}
        <div className="shrink-0 self-start sm:self-auto">
          {canClaim ? (
            <button
              type="button"
              onClick={handleClaim}
              disabled={claiming}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {claiming ? (
                <>
                  <FaSpinner className="animate-spin" size={12} />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <FaGift size={12} />
                  <span>Claim Day {targetDay} (₦{rewards[targetDay - 1]?.reward})</span>
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-slate-300">
              <FaClock size={11} className="text-emerald-400" />
              <span>Next: <strong className="font-mono text-emerald-300">{timeLeft}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="mt-2 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2">
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
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 pt-2 relative z-10">
        {rewards.map((r) => {
          const isPastClaimed = !canClaim ? r.day <= currentStreak : r.day < targetDay;
          const isCurrentTarget = canClaim && r.day === targetDay;
          const isMega = r.isMega;

          return (
            <div
              key={r.day}
              className={`rounded-xl py-1.5 px-1 text-center transition-all flex flex-col items-center justify-between gap-0.5 relative ${
                isCurrentTarget
                  ? "bg-emerald-500/30 border border-emerald-400 shadow-xs scale-102"
                  : isPastClaimed
                  ? "bg-emerald-950/40 border border-emerald-700/40 text-slate-300"
                  : isMega
                  ? "bg-amber-950/30 border border-amber-500/40 text-amber-200"
                  : "bg-white/5 border border-white/5 text-slate-400"
              }`}
            >
              {/* Day Label */}
              <span className="text-[9px] sm:text-[10px] font-bold tracking-tight">
                {r.label}
              </span>

              {/* Icon / Status */}
              <div className="my-0.5">
                {isPastClaimed ? (
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto text-[9px] font-bold">
                    <FaCheck size={9} />
                  </div>
                ) : isCurrentTarget ? (
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center mx-auto animate-pulse">
                    <FaGift size={10} />
                  </div>
                ) : isMega ? (
                  <div className="w-4.5 h-4.5 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center mx-auto">
                    <FaCrown size={10} />
                  </div>
                ) : (
                  <span className="text-[10px]">🎁</span>
                )}
              </div>

              {/* Reward Amount */}
              <span
                className={`text-[10px] sm:text-[11px] font-black font-mono leading-none ${
                  isCurrentTarget
                    ? "text-emerald-300"
                    : isMega
                    ? "text-amber-300"
                    : isPastClaimed
                    ? "text-emerald-400"
                    : "text-slate-400"
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
