import React from "react";
import { FaRegFolderOpen } from "react-icons/fa6";

const NoData = ({ textBelow }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-gray-300 text-center">
      <FaRegFolderOpen size={72} />
      <p className="text-xs text-gray-400">{textBelow}</p>
    </div>
  );
};

export default NoData;
