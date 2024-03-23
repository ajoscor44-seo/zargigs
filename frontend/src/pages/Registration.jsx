import React, { useState } from "react";
import SignUp from "./SignUp";
import VerifyEmailAddress from "./VerifyEmailAddress";

const RegistrationPage = () => {
  const [signedIn, setSignedIn] = useState(
    sessionStorage.getItem("auth-user-email")
  );

  return (
    <div>
      {signedIn ? <VerifyEmailAddress /> : <SignUp setSignedIn={setSignedIn} />}
    </div>
  );
};

export default RegistrationPage;
