import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { TfiMenuAlt } from "react-icons/tfi";
import referreIcon from "../../assets/png/referrer-icon.png";

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
  name,
  handleChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col mt-1">
      <span className="text-xs font-semibold mb-2">{label}</span>
      {useTextArea ? (
        <textarea
          className="border rounded outline-none p-2"
          placeholder={placeholder}
          rows={5}
        ></textarea>
      ) : (
        <div
          className={
            fullRounded
              ? "border rounded-full flex items-center py-4 px-5 gap-2" +
                (icon == "referrer" && value ? " bg-slate-50 opacity-60" : " ")
              : "border rounded flex items-center py-4 px-5 gap-2"
          }
        >
          <div className="text-slate-600">
            {icon == "password" ? (
              <FaLock />
            ) : icon == "email" ? (
              <MdEmail size={20} />
            ) : icon == "user" ? (
              <FaUser size={20} />
            ) : icon == "referrer" ? (
              <img
                className="w-6 h-6 object-cover"
                src={referreIcon}
                alt="Referrer Icon"
              />
            ) : (
              <TfiMenuAlt size={20} />
            )}
          </div>
          <div className="flex-1">
            {useSelect ? (
              <select className="w-full outline-none">
                {selections.map((selection) => {
                  return (
                    <option className="p-4 text-xs text-slate-600 font-semibold">
                      {selection}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                className="w-full outline-none placeholder:text-sm"
                type={icon == "password" && showPassword ? "text" : type}
                placeholder={placeholder}
                defaultValue={value}
                disabled={icon == "referrer" && value}
                name={name}
                onChange={(e) => handleChange(e)}
              />
            )}
          </div>
          <div>
            {isError ? (
              <PiWarningCircle size={20} className="text-red-400" />
            ) : (
              <div></div>
            )}
            {icon == "password" ? (
              <span
                className="text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
              </span>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
      <span
        className={
          "methodNote leading-4 mt-1 font-semibold " +
          (isError ? "text-red-400" : "text-slate-500")
        }
      >
        {isError ? errorMsg : note}
      </span>
    </div>
  );
};

export default FormInput;
