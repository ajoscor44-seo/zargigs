import React, { useState, useEffect } from "react";
import { FaXmark, FaSpinner } from "react-icons/fa6";

const TextAreaModal = ({
  title,
  description,
  visible,
  isAdding,
  handleVisibility,
  btnText,
  text,
  setText,
  postText,
}) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-primary">
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={handleVisibility}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-slate-900/10 transition-all transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {title || "Reason for Action"}
          </h3>
          <button
            type="button"
            disabled={isAdding}
            onClick={handleVisibility}
            className="p-1.5 -mr-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <FaXmark size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold leading-relaxed">
            {error}
          </div>
        )}

        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            {description || "Please enter your explanation below:"}
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your notes or reasons here..."
            className="w-full p-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none text-slate-800 placeholder-slate-400 bg-slate-50/50"
            rows={4}
          />
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isAdding}
            onClick={handleVisibility}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-98 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isAdding}
            onClick={async () => await postText(text, setError)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAdding ? (
              <>
                <FaSpinner className="animate-spin" size={14} />
                <span>Processing...</span>
              </>
            ) : (
              <span>{btnText || "Submit"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextAreaModal;
