import React from "react";
import { FiInbox, FiSearch, FiLayers } from "react-icons/fi";
import { FaWallet, FaReceipt } from "react-icons/fa6";

const NoData = ({
  title,
  textBelow,
  description,
  icon: CustomIcon,
  actionText,
  onAction,
  className = "",
}) => {
  const resolvedText = description || textBelow || "No records found yet";

  const renderIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-7 h-7 text-emerald-600" />;

    const lower = resolvedText.toLowerCase();
    if (
      lower.includes("funding") ||
      lower.includes("deposit") ||
      lower.includes("wallet") ||
      lower.includes("transaction")
    ) {
      return <FaWallet className="w-7 h-7 text-emerald-600" />;
    }
    if (
      lower.includes("task") ||
      lower.includes("subtask") ||
      lower.includes("proof")
    ) {
      return <FiLayers className="w-7 h-7 text-emerald-600" />;
    }
    if (
      lower.includes("search") ||
      lower.includes("match") ||
      lower.includes("query")
    ) {
      return <FiSearch className="w-7 h-7 text-emerald-600" />;
    }
    if (
      lower.includes("order") ||
      lower.includes("campaign") ||
      lower.includes("history")
    ) {
      return <FaReceipt className="w-7 h-7 text-emerald-600" />;
    }
    return <FiInbox className="w-7 h-7 text-emerald-600" />;
  };

  return (
    <div
      className={`w-full py-7 px-4 flex flex-col items-center justify-center text-center select-none ${className}`}
    >
      {/* Modern Layered Floating Aura Icon */}
      <div className="relative mb-3">
        <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-lg" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-b from-white to-emerald-50/70 border border-emerald-100 shadow-sm shadow-emerald-500/10 flex items-center justify-center">
          {renderIcon()}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
      </div>

      {/* Title (if provided) */}
      {title && (
        <h4 className="text-sm font-black text-slate-800 tracking-tight mb-0.5">
          {title}
        </h4>
      )}

      {/* Description Text */}
      <p className="text-xs font-semibold text-slate-400 max-w-xs leading-relaxed">
        {resolvedText}
      </p>

      {/* Optional action */}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs font-bold transition-all cursor-pointer border border-emerald-200/60"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default NoData;
