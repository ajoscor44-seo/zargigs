import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhone,
  FaTag,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { TfiMenuAlt } from "react-icons/tfi";

const FormInput = ({
  icon,
  label,
  placeholder,
  note,
  errorMsg,
  isError,
  type,
  fullRounded,
  useTextArea,
  useSelect,
  selections,
  value,
  defaultValue,
  name,
  handleChange,
  hideDropIcon,
  maxLength,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isControlled = value !== undefined;

  return (
    <div className="flex flex-col mt-1">
      {label && (
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          {maxLength && (
            <span className="text-[10px] text-slate-400 font-normal">
              {value?.length || 0}/{maxLength}
            </span>
          )}
        </label>
      )}
      {useTextArea ? (
        <textarea
          className={`w-full p-3.5 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
            isError
              ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
              : "border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          }`}
          placeholder={placeholder}
          rows={4}
          {...(isControlled ? { value: value || "" } : { defaultValue })}
          onChange={handleChange}
          name={name}
          disabled={disabled}
        ></textarea>
      ) : (
        <div
          className={`group flex items-center px-3.5 py-3 rounded-xl border transition-all ${
            disabled ? "opacity-60 bg-slate-100 cursor-not-allowed" : ""
          } ${
            isError
              ? "border-red-300 bg-red-50/30 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500"
              : "border-slate-200 bg-slate-50/50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 focus-within:bg-white"
          }`}
        >
          <div className="text-slate-400 group-focus-within:text-emerald-600 transition-colors mr-3 shrink-0">
            {icon === "password" ? (
              <FaLock size={15} />
            ) : icon === "link" ? (
              <FaTag size={15} />
            ) : icon === "email" ? (
              <MdEmail size={17} />
            ) : icon === "phone" ? (
              <FaPhone size={14} />
            ) : icon === "user" ? (
              <FaUser size={14} />
            ) : icon === "referrer" ? (
              <FaUsers size={16} />
            ) : (
              <TfiMenuAlt size={15} />
            )}
          </div>
          <div className="flex-1">
            {useSelect ? (
              <select
                className="w-full bg-transparent outline-none text-slate-900 text-sm font-medium cursor-pointer"
                name={name}
                onChange={handleChange}
                {...(isControlled ? { value: value || "" } : { defaultValue })}
                disabled={disabled}
              >
                {selections &&
                  selections.map((selection) => (
                    <option
                      key={selection}
                      value={selection}
                      className="p-2 text-sm text-slate-700"
                    >
                      {selection}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                className="w-full bg-transparent outline-none text-slate-900 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                type={icon === "password" && showPassword ? "text" : type}
                placeholder={placeholder}
                disabled={disabled}
                name={name}
                {...(isControlled ? { value: value ?? "" } : { defaultValue })}
                maxLength={maxLength}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="flex items-center gap-2 ml-2">
            {isError && (
              <PiWarningCircle size={18} className="text-red-500 shrink-0" />
            )}
            {icon === "password" && (
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            )}
          </div>
        </div>
      )}
      {(note || isError) && (
        <span
          className={`text-[11px] mt-1.5 font-medium leading-relaxed ${
            isError ? "text-red-500 font-semibold" : "text-slate-500"
          }`}
        >
          {isError ? errorMsg : note}
        </span>
      )}
    </div>
  );
};

export default FormInput;
