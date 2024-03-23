import React, { useState } from "react";
import Login from "./Login";
import VerifyEmail from "../components/VerifyEmail/VerifyEmail";

const Authentication = () => {
  const [notVerified, setNotVerified] = useState(false);

  return (
    <div>
      {notVerified ? (
        <div className="bg-slate-50">
          <VerifyEmail isLoginPage={true} setNotVerified={setNotVerified} />
        </div>
      ) : (
        <Login setNotVerified={setNotVerified} />
      )}
    </div>
  );
};

export default Authentication;
