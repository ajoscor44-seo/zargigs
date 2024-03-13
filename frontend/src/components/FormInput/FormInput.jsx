import React from "react";
import { PiWarningCircle } from "react-icons/pi";
import { TfiMenuAlt } from "react-icons/tfi";

const FormInput = ({
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
}) => {
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
              ? "border rounded-full flex items-center py-4 px-5 gap-2"
              : "border rounded flex items-center py-4 px-5 gap-2"
          }
        >
          <div className="text-slate-600">
            <TfiMenuAlt size={20} />
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
                type={type}
                placeholder={placeholder}
              />
            )}
          </div>
          <div>
            {isError ? (
              <PiWarningCircle size={20} className="text-red-400" />
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
