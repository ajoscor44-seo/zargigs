import React from "react";

const Modal = ({
  title,
  content,
  posBtnText,
  negBtnText,
  onPosClick,
  onNegClick,
}) => {
  return (
    <div className="w-screen h-screen backdrop-blur-sm z-20 fixed top-0 flex justify-center items-center transform transition-all animate-scale-up">
      <div
        className="bg-white border rounded w-80"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-dark font-semibold px-3 pt-3 border-b mb-1">
          {title}
        </h2>
        <div className="text-sm px-3 text-gray-600">{content}</div>
        <div className="flex items-center justify-end gap-2 pb-3 px-3">
          <button
            onClick={onNegClick}
            className="bg-red-500 px-5 py-1 text-sm text-white rounded-full"
          >
            {negBtnText}
          </button>
          <button
            onClick={onPosClick}
            className="bg-green-500 px-5 py-1 text-sm text-white rounded-full"
          >
            {posBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
