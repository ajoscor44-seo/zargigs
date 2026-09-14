import React, { useState } from "react";
import FormInput from "../FormInput/FormInput";
import { FaArrowLeft, FaArrowRight, FaSpinner, FaCheck, FaShieldHalved } from "react-icons/fa6";
import OAuth from "../OAuth/OAuth";

const PageSlider = ({
  errorMsg,
  setError,
  isLoading,
  pages,
  handleChange,
  handleSubmit,
  handleInputError,
  formData,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const stepLabels = [
    { name: "Personal", desc: "Names & Referrer" },
    { name: "Account", desc: "Handle & Contact" },
    { name: "Security", desc: "Create Password" },
  ];

  const nextPage = () => {
    const inputError = handleInputError(currentPage);
    if (inputError) {
      return;
    }
    if (currentPage === pages.length - 1) {
      return handleSubmit();
    }
    if (setError) setError(null);
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const prevPage = () => {
    if (currentPage === 0) return;
    if (setError) setError(null);
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const activePage = pages[currentPage];

  return (
    <div className="flex flex-col">
      {/* Compact Step Progress Bar */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-2 relative">
          {stepLabels.map((step, idx) => {
            const isDone = idx < currentPage;
            const isCurrent = idx === currentPage;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (idx < currentPage) {
                    if (setError) setError(null);
                    setCurrentPage(idx);
                  }
                }}
                className={`flex flex-col items-center text-center p-2 rounded-2xl transition-all ${
                  isCurrent
                    ? "bg-emerald-50/80 border border-emerald-200/80 shadow-xs"
                    : isDone
                    ? "bg-slate-50 hover:bg-slate-100 cursor-pointer"
                    : "opacity-40"
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[11px] mb-1 transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-emerald-600 text-white ring-3 ring-emerald-100"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? <FaCheck size={10} /> : idx + 1}
                </div>
                <div className="text-[11px] font-extrabold text-slate-800 tracking-tight">
                  {step.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continuous Active Line */}
        <div className="w-full bg-slate-100 h-1 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Header */}
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {activePage.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          {activePage.info}
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Account Intent Selection on Step 1 */}
      {currentPage === 0 && (
        <div className="mb-5 space-y-2">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
            What is your main goal?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Option 1: Earner */}
            <button
              type="button"
              onClick={() => handleChange({ target: { name: "accountType", value: "earner" } })}
              className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                (formData?.accountType || "earner") === "earner"
                  ? "border-emerald-500 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">⚡</span>
                {(formData?.accountType || "earner") === "earner" && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px]">
                    <FaCheck />
                  </span>
                )}
              </div>
              <div>
                <div className="font-black text-xs text-slate-900">Earn Money</div>
                <p className="text-[10px] text-slate-500 leading-tight font-normal mt-0.5">
                  Complete daily microtasks & earn cash.
                </p>
              </div>
            </button>

            {/* Option 2: Advertiser */}
            <button
              type="button"
              onClick={() => handleChange({ target: { name: "accountType", value: "advertiser" } })}
              className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                formData?.accountType === "advertiser" || formData?.accountType === "retailer"
                  ? "border-purple-500 bg-purple-50/60 shadow-xs ring-2 ring-purple-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">📢</span>
                {(formData?.accountType === "advertiser" || formData?.accountType === "retailer") && (
                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[8px]">
                    <FaCheck />
                  </span>
                )}
              </div>
              <div>
                <div className="font-black text-xs text-slate-900">Promote & Grow</div>
                <p className="text-[10px] text-slate-500 leading-tight font-normal mt-0.5">
                  Post campaigns & get engagements.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-3.5 mb-5">
        {activePage.formInputs.map((formInput) => (
          <div key={formInput.name}>
            <FormInput
              label={formInput.label}
              placeholder={formInput.placeholder}
              note={formInput.note}
              fullRounded={false}
              type={formInput.type}
              icon={formInput.icon}
              isError={formInput.isError}
              errorMsg={formInput.error}
              value={
                formData && formData[formInput.name] !== undefined
                  ? formData[formInput.name]
                  : (formInput.value ?? "")
              }
              name={formInput.name}
              disabled={formInput.disabled}
              handleChange={handleChange}
              maxLength={formInput.maxLength}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-2.5 pt-1">
        {currentPage > 0 ? (
          <button
            type="button"
            disabled={isLoading}
            onClick={prevPage}
            className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FaArrowLeft size={11} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          disabled={isLoading}
          onClick={nextPage}
          className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" size={15} />
              <span>Creating Account...</span>
            </>
          ) : currentPage === pages.length - 1 ? (
            <>
              <FaShieldHalved size={14} />
              <span>Complete Free Registration</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <FaArrowRight size={12} />
            </>
          )}
        </button>
      </div>

      {/* Social Google Signup on First Step */}
      {currentPage === 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <OAuth setError={setError} text="Sign up with Google" />
        </div>
      )}
    </div>
  );
};

export default PageSlider;
