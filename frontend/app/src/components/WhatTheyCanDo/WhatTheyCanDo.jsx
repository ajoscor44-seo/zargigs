import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

const WhatTheyCanDo = ({
  btnText,
  actionDesription,
  actionTitle,
  actionPersonnel,
  pathTo,
}) => {
  return (
    <div className="font-primary">
      <span className="text-xs">For {actionPersonnel}</span>
      <h2 className="font-bold text-md mt-3 leading-5">{actionTitle}</h2>
      <p className="mt-5 text-sm leading-5">{actionDesription}</p>
      <Link to={pathTo}>
        <button className="bg-green-500 rounded-sm font-semibold py-3 px-4 text-white mt-4 uppercase text-xs">
          {btnText}
        </button>
      </Link>
    </div>
  );
};

export default WhatTheyCanDo;
