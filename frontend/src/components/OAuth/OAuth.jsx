import React from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import googleIcon from "../../assets/png/google-icon.png";
import { app } from "../../config/firebase.config";
import { useAuth } from "../../context/AuthContext";

const OAuth = () => {
  const { OAuthUser } = useAuth();
  const auth = getAuth(app);

  const handleOAuth = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const cred = await signInWithPopup(auth, provider);
      const res = OAuthUser(cred);
      console.log(res);
    } catch (error) {
      console.log("Could not login with google", error);
    }
  };

  return (
    <div
      onClick={handleOAuth}
      className="btn rounded-sm flex justify-center items-center gap-2 font-primary text-red-600 border mt-3"
    >
      <img src={googleIcon} className="w-8" />
      <span className="text-xl text-dark">Continue With Google</span>
    </div>
  );
};

export default OAuth;
