import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import googleIcon from "../../assets/png/google-icon.png";
import { app } from "../../config/firebase.config";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const OAuth = ({ setError }) => {
  const { OAuthUser } = useAuth();
  const auth = getAuth(app);
  const history = useHistory();

  const handleOAuth = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const cred = await signInWithPopup(auth, provider);
      const res = await OAuthUser(cred);
      if (res.statusCode == 500) {
        setError("Internal Server Error. Please try again later.");
        return;
      }
      setError(null);
      history.push("/dashboard");
    } catch (error) {
      return error;
    }
  };

  return (
    <div
      onClick={handleOAuth}
      className="btn cursor-pointer rounded-sm flex justify-center items-center gap-2 font-primary text-red-600 border mt-3"
    >
      <img src={googleIcon} className="w-8" />
      <span className="text-xl text-dark">Continue With Google</span>
    </div>
  );
};

export default OAuth;
