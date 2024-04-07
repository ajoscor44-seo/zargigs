import numeral from "numeral";
import React from "react";

const PayAmountBar = ({ feeTitle, fee, btnText, handleClick, disable }) => {
  return (
    <div className="bg-white flex justify-between items-center fixed bottom-16 pt-0 pb-1 w-full px-5 border">
      <p>
        <span className="methodNote">{feeTitle}</span>
        <h2 className="font-semibold text-2xl">
          ₦{numeral(fee).format("0,0")}
        </h2>
      </p>

      <button
        onClick={handleClick}
        disabled={disable}
        className={
          "uppercase text-xs bg-primaryLight py-2 px-4 rounded-sm text-white font-semibold" +
          (disable ? " opacity-50" : "")
        }
      >
        {btnText}
      </button>
    </div>
  );
};

export default PayAmountBar;
