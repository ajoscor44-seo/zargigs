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
  const provider = new GoogleAuthProvider();

  const handleOAuth = async () => {
    try {
      setDisabledBtn(true);
      const cred = await signInWithPopup(auth, provider);
      console.log(cred);
      const res = await OAuthUser(cred);
      if (res.statusCode == 500) {
        setDisabledBtn(false);
        setError("Internal Server Error. Please try again later.");
        return;
      }
      setDisabledBtn(false);
      setError(null);
      await fetchUserData();
      return history.push("/");
    } catch (error) {
      setDisabledBtn(false);
      setError(error.message);
      return console.error(error);
    }
  };

  return (
    <button
      onClick={handleOAuth}
      disabled={disabledBtn}
      className={`btn cursor-pointer rounded-sm flex justify-center items-center gap-2 font-primary text-red-600 border mt-3 ${
        disabledBtn ? "opacity-50" : ""
      }`}
    >
      <img src={googleIcon} className="w-8" />
      <span className="text-xl text-dark">Continue With Google</span>
    </button>
  );
};

export default OAuth;
