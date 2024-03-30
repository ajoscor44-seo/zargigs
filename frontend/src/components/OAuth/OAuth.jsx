import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import googleIcon from "../../assets/png/google-icon.png";
import { app } from "../../config/firebase.config";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const OAuth = ({ setError }) => {
  const [disabledBtn, setDisabledBtn] = useState(false);
  const { OAuthUser, fetchUserData } = useAuth();
  const auth = getAuth(app);
  const history = useHistory();

  const handleOAuth = async () => {
    setDisabledBtn(true);
    const provider = new GoogleAuthProvider();

    try {
      const cred = await signInWithPopup(auth, provider);
      const res = await OAuthUser(cred);
      if (res.statusCode == 500) {
        setDisabledBtn(false);
        setError("Internal Server Error. Please try again later.");
        return;
      }
      setDisabledBtn(false);
      setError(null);
      await fetchUserData()
      history.push("/dashboard");
    } catch (error) {
      return error;
    }
  };

  return (
    <button disabled={disabledBtn} className={disabledBtn && "opacity-50"}>
      <div
        onClick={handleOAuth}
        className="btn cursor-pointer rounded-sm flex justify-center items-center gap-2 font-primary text-red-600 border mt-3"
      >
        <img src={googleIcon} className="w-8" />
        <span className="text-xl text-dark">Continue With Google</span>
      </div>
    </button>
  );
};

export default OAuth;
