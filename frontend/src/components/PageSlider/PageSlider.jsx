import React, { useState } from "react";
import FormInput from "../FormInput/FormInput";
import { IoArrowBackSharp, IoArrowForwardSharp } from "react-icons/io5";

const PageSlider = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage === pages.length - 1) {
      return;
    }
    setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
  };
  const prevPage = () => {
    if (currentPage === 0) {
      return;
    }
    setCurrentPage((prevPage) => (prevPage - 1) % pages.length);
  };

  const containerWidth = pages.length * 100;

  return (
    <div className="overflow-hidden relative h-full flex flex-col justify-center border-red-200">
      <div
        style={{
          transform: `translateX(-${currentPage * 100}%)`,
          width: `${containerWidth}%`,
        }}
        className="transition-transform duration-500"
      >
        <div className="grid grid-cols-2" style={{ minWidth: "200%" }}>
          {pages.map((page, index) => (
            <div key={index} className={`${page.bgColor} flex flex-col`}>
              <h2
                className="text-2xl text-center mb-1 font-semibold"
                style={{ width: "50%" }}
              >
                {page.title}
              </h2>
              <p className="text-sm text-center" style={{ width: "50%" }}>
                {page.info}
              </p>
              <div
                className="flex flex-col gap-3 mt-2 py-2 overflow-y-scroll shadow-inner border-b"
                style={{ width: "50%", height: "250px" }}
              >
                {page.formInputs.map((formInput) => {
                  return (
                    <div className="mx-2">
                      <FormInput
                        label={formInput.label}
                        placeholder={formInput.placeholder}
                        note={formInput.note}
                        fullRounded={true}
                        type={formInput.type}
                        icon={formInput.icon}
                        isError={formInput.isError}
                        errorMsg={formInput.error}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4 mx-3 items-center">
        <button
          disabled={currentPage === 0}
          onClick={prevPage}
          className={`bg-slate-500 text-white py-2 px-4 rounded outline-none flex items-center gap-1 ${
            currentPage === 0 ? "disabledBtn" : ""
          }`}
        >
          <IoArrowBackSharp />
          <span>Back</span>
        </button>
        <button
          disabled={currentPage === pages.length}
          onClick={nextPage}
          className={
            "bg-primaryLight text-white py-2 px-4 rounded outline-none flex items-center gap-1"
          }
        >
          <span>Next</span>
          <IoArrowForwardSharp />
        </button>
      </div>
    </div>
  );
};

export default PageSlider;
