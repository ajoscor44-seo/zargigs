import React, { useState } from "react";
import { FaPowerOff } from "react-icons/fa6";

const ClientWelcomeMsg = ({ username }) => {
  const [userName, setuserName] = useState(username);

  return (
    <div className="undernav bg-white font-primary px-4 py-2 border flex items-center justify-between">
      <div className="font-bold text-md">
        Welcome, <span className="text-primary">{userName}</span>
      </div>
      <div className="font-semibold text-red-600 flex items-center gap-1 cursor-pointer hover:text-red-500">
        <FaPowerOff />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default ClientWelcomeMsg;
