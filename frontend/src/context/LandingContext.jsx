import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const defaultAdminData = {
  appName: "DocsZar",
  membershipFee: 1000,
  withdrawalCharges: 50,
  minWithdrawal: 1000,
  referralBonus: 500,
};

const AuthProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(defaultAdminData);

  // Gets admin data asynchronously
  const getAdminData = async () => {
    try {
      const response = await axios.get(
        `/api/v1/admin-data?no-cache=${new Date().getTime()}`
      );

      if (response?.data && response.data.length > 0) {
        setAdminData(response.data[0]);
      }
    } catch (error) {
      console.warn("Using default platform data:", error?.message);
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
