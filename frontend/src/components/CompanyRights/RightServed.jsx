import React from "react";
import { useAuth } from "../../../app/src/context/AuthContext";

const RightServed = () => {
  const { adminData } = useAuth();
  return (
    <div className="bg-slate-50 flex flex-col items-center gap-2 p-4">
      <h3 className="font-medium font-primary">
        {adminData?.appName} was developed by -{" "}
        <a
          className="text-green-500 hover:underline cursor-pointer"
          href="https://twitter.com/__LeeMao"
          target="_blank"
        >
          Lëë Mãõ
        </a>
      </h3>
      <h3 className="text-sm font-primary font-normal">
        &copy; 2024. All Rights Reserved
      </h3>
    </div>
  );
};

export default RightServed;
