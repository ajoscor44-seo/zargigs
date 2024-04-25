import React from "react";

const Disclaimer = ({ disclaimerMsg }) => {
  return (
    <div className="bg-red-200 text-red-800 py-3 px-4 font-primary">
      <h2 className="font-bold">Disclaimer!</h2>
      <p className="disclaimerMsg">{disclaimerMsg}</p>
    </div>
  );
};

export default Disclaimer;
