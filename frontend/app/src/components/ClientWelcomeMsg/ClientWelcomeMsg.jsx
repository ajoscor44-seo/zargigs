import React, { useState } from "react";
import { FaPowerOff } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const ClientWelcomeMsg = ({ username }) => {
  const { logoutUser } = useAuth();
  const history = useHistory();
  const [error, setError] = useState(null);

  const logout = async () => {
    const logoutRes = await logoutUser();

    if (logoutRes.failed) setError(logoutRes.message);

    return history.push("/login");
  };

  return (
    <div className="undernav bg-white font-primary px-4 py-2 border flex items-center justify-between">
      <div className="font-bold text-md">
        Welcome, <span className="text-primary">{username}</span>
      </div>
      <div
        onClick={logout}
        className="font-semibold text-red-600 flex items-center gap-1 cursor-pointer hover:text-red-500"
      >
        <FaPowerOff />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default ClientWelcomeMsg;
