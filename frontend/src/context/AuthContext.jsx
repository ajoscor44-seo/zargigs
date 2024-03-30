import React, { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(
    sessionStorage.getItem("access_token") || null
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    return await fetch("http://localhost:3000/api/v1/user/user-details", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchUserData = async () => {
    setLoading(true);
    setUserToken(sessionStorage.getItem("access_token"));
    const user = await getCurrentUser();
    setLoading(false);
    return setCurrentUser(user);
  };

  useEffect(() => {
    fetchUserData();
  }, [userToken]);

  const loginUser = async (email, password) => {
    try {
      const formData = {
        email,
        password,
      };
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  const signupUser = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  const OAuthUser = async (cred) => {
    const res = await fetch("http://localhost:3000/api/v1/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cred.user.displayName,
        email: cred.user.email,
        isEmailVerified: cred.user.emailVerified,
        image: cred.user.photoURL,
        referredBy: "admin",
        role: "user",
        isMember: false,
      }),
    });

    const data = await res.json();
    if (!data.failed) {
      setUserToken(data);
    }
    return user;
  };

  const verifyUserEmail = async (email, otp) => {
    try {
      const formData = {
        email,
        otp,
      };
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/verifyWithOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {
      return error;
    }
  };

  const AuthValue = {
    userToken,
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
