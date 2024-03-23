import React, { useState } from "react";
import SignUp from "./SignUp";
import VerifyEmail from "../components/VerifyEmail/VerifyEmail";

const RegistrationPage = () => {
  const [signedIn, setSignedIn] = useState(
    sessionStorage.getItem("auth-user-email")
  );

  return (
    <div>
      {signedIn ? (
        <div className="bg-slate-50">
          <VerifyEmail />
        </div>
      ) : (
        <SignUp setSignedIn={setSignedIn} />
      )}
    </div>
  );
};

export default RegistrationPage;
