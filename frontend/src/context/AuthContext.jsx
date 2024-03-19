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
      const user = await response.json();
      if (!user.message) {
        setCurrentUser(user);
      }
      return user;
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
      const res = await response.json();
      if (!res.message) {
        setCurrentUser(res);
      }
      return res;
    } catch (error) {
      console.log(error);
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

    const user = await res.json();
    if (!user.message) {
      setCurrentUser(user);
    }
    return user;
  };

  const AuthValue = {
    currentUser,
    loginUser,
    signupUser,
    OAuthUser,
  };

  return (
    <AuthContext.Provider value={AuthValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
