import React, { useEffect } from "react";
import { FaXmark, FaBoltLightning } from "react-icons/fa6";

const Modal = ({
  title,
  content,
  posBtnText,
  negBtnText,
  onPosClick,
  onNegClick,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-primary">
      {/* Background Overlay Click to Close */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={onNegClick}
        aria-hidden="true"
      />

      {/* Modal Content Box */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-slate-900/10 transition-all transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FaBoltLightning size={16} />
            </div>
            {title && (
              <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                {title}
              </h3>
            )}
          </div>
          {onNegClick && (
            <button
              type="button"
              onClick={onNegClick}
              className="p-1.5 -mr-1.5 -mt-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <FaXmark size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="mt-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {typeof content === "string" ? (
            <p>{content}</p>
          ) : (
            <div className="max-h-[65vh] overflow-y-auto rounded-2xl flex items-center justify-center bg-slate-50 p-2">
              {content}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          {negBtnText && (
            <button
              type="button"
              onClick={onNegClick}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-98 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              {negBtnText}
            </button>
          )}
          {posBtnText && (
            <button
              type="button"
              onClick={onPosClick}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{posBtnText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
