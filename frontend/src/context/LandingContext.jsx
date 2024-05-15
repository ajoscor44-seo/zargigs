import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gets admin data
  const getAdminData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/admin");

      if (response.data.failed) {
        return response.data.message;
      }

      setAdminData(response.data[0]);
      return setLoading(false);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);

  const AuthValue = {
    adminData,
  };
  return (
    <AuthContext.Provider value={AuthValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
