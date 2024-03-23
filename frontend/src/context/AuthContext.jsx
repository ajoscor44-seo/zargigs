import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const [loading, setLoading] = useState();

  useEffect(() => {
    return localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

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
      if (!data.failed) {
        setCurrentUser(data);
      }
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
      const data = await response.json();
      if (!data.failed) {
        localStorage.setItem("newUser", JSON.stringify(formData));
      }

      return data;
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
      setCurrentUser(data);
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
    currentUser,
    loginUser,
    signupUser,
    OAuthUser,
    verifyUserEmail,
  };

  return (
    <AuthContext.Provider value={AuthValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
