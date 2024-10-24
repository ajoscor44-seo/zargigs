import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";

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
  const vwWidth = (window.innerWidth * 90) / 100;
  const isWider = vwWidth > 400;

  return (
    <div
      className={`bg-dark modal_bg ${
        visible ? "" : "hidden"
      } fixed top-0 left-0 min-h-screen w-screen flex justify-center items-center`}
    >
      <div
        className="flex flex-col bg-white items-center justify-center p-3 rounded"
        style={{ maxWidth: isWider ? "400px" : vwWidth }}
      >
        <div className="flex items-center gap-10 justify-between w-full">
          <h1 className="font-bold italic">{title}</h1>
          <span
            disabled={isAdding}
            onClick={handleVisibility}
            className="cursor-pointer border-2 border-white hover:border-red-200 rounded-full"
          >
            <IoClose className="text-red-600" size={24} />
          </span>
        </div>

        {error && (
          <p className="font-semibold text-red-600 text-xs bg-red-200 w-full text-center py-1 rounded">
            {error}
          </p>
        )}
        <div>
          <p className="text-xs font-bold my-2 text-gray-500">
            {description ||
              "Please, input your Text in the space provided below."}
          </p>
          <textarea
            onChange={(e) => setText(e.target.value)}
            placeholder="Input your issue here."
            className="border p-2 border-gray-300 outline-none rounded w-full"
            rows={5}
          ></textarea>
        </div>

        <div className="mt-2 flex justify-end w-full gap-3">
          <button
            disabled={isAdding}
            onClick={handleVisibility}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Close
          </button>
          <button
            disabled={isAdding}
            onClick={async () => await postText(text, setError)}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            {isAdding ? <FaSpinner size="15" variant="white" /> : btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextAreaModal;
