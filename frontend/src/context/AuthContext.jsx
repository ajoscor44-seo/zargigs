import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    return await axios
      .get("/api/v1/user/user-details")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchUserData = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    setLoading(false);
    if (user.failed) return setCurrentUser(null);
    return setCurrentUser(user);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const formData = {
        email,
        password,
      };

      const response = await axios.post("/api/v1/auth/login", formData);

      const data = response.data;
      return data;
    } catch (error) {
      return error;
    }
  };

  const signupUser = async (formData) => {
    try {
      const response = await axios.post("/api/v1/auth/signup", formData);

      const data = response.data;
      return data;
    } catch (error) {
      return error;
    }
  };

  const OAuthUser = async (cred) => {
    try {
      const res = await axios.post("/api/v1/auth/google", {
        name: cred.user.displayName,
        email: cred.user.email,
        isEmailVerified: cred.user.emailVerified,
        image: cred.user.photoURL,
        referredBy: "admin",
        role: "user",
        isMember: false,
      });

      const data = res.data;
      return data;
    } catch (error) {
      return error;
    }
  };

  const verifyUserEmail = async (email, otp) => {
    try {
      const formData = {
        email,
        otp,
      };
      const response = await axios.post("/api/v1/auth/verifyWithOTP", formData);
      const data = response.data;

      return data;
    } catch (error) {
      return error;
    }
  };

  const AuthValue = {
    currentUser,
    fetchUserData,
    loginUser,
    signupUser,
    OAuthUser,
    verifyUserEmail,
  };

  return (
    <AuthContext.Provider value={AuthValue}>
      {loading ? (
        <div>
          <Spinner size={25} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
