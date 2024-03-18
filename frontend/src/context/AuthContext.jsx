import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser")
  );
  const [loading, setLoading] = useState();

  useEffect(() => {
    localStorage.setItem("currentUser", currentUser);
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

  const AuthValue = {
    currentUser,
    loginUser,
    signupUser,
  };

  return (
    <AuthContext.Provider value={AuthValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
