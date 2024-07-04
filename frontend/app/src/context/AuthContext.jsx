import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import deviceNotAllowedImg from "../assets/png/device_not_allowed.png";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [advertCreator, setAdvertCreator] = useState([]);
  const [engagementCreator, setEngagementCreator] = useState([]);
  const [advertEarner, setAdvertEarner] = useState([]);
  const [engagementEarner, setEngagementEarner] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    return await axios
      .get("/api/v1/user/user-details")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

  // Gets admin data
  const getAdminData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/admin-data");

      return setAdminData(response.data[0]);
    } catch (error) {
      return error;
    }
  };

  // Gets advert creator data
  const getAdvertCreator = async () => {
    try {
      const response = await axios.get("/api/v1/creator/create-advert");

      return setAdvertCreator(response.data.data);
    } catch (error) {
      return error;
    }
  };

  // Gets engagement creator data
  const getEngagementCreator = async () => {
    try {
      const response = await axios.get("/api/v1/creator/create-engagement");

      return setEngagementCreator(response.data.data);
    } catch (error) {
      return error;
    }
  };

  // Gets advert earners data
  const getAdvertEarners = async () => {
    try {
      const response = await axios.get("/api/v1/earner/earn-advert");

      return setAdvertEarner(response.data.data);
    } catch (error) {
      return error;
    }
  };

  // Gets engagement earners data
  const getEngagementEarners = async () => {
    try {
      const response = await axios.get("/api/v1/earner/earn-engagement");

      return setEngagementEarner(response.data.data);
    } catch (error) {
      return error;
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    setLoading(false);
    if (!user || user?.failed) return setCurrentUser(null);
    return setCurrentUser(user);
  };

  useEffect(() => {
    fetchUserData();
    getAdminData();
    getAdvertCreator();
    getEngagementCreator();
    getEngagementEarners();
    getAdvertEarners();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const formData = {
        email,
        password,
      };

      const response = await axios.post("/api/auth/login", formData);

      const data = response.data;
      return data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.get("/api/auth/logout");

      const data = response.data;
      return data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  };

  const signupUser = async (formData) => {
    try {
      const response = await axios.post("/api/auth/signup", formData);

      const data = response.data;
      return data;
    } catch (error) {
      return { failed: true, message: error.response.data.message };
    }
  };

  const OAuthUser = async (cred) => {
    try {
      const res = await axios.post("/api/auth/google", {
        name: cred.user.displayName,
        email: cred.user.email,
        isEmailVerified: cred.user.emailVerified,
        image: cred.user.photoURL,
        phone: cred.user.phone,
      });

      const data = res.data;
      return data;
    } catch (error) {
      return console.log(error);
    }
  };

  const verifyUserEmail = async (email, otp) => {
    try {
      const formData = {
        email,
        otp,
      };
      const response = await axios.post("/api/auth/verifyWithOTP", formData);
      const data = response.data;

      return data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  };

  const AuthValue = {
    currentUser,
    adminData,
    advertEarner,
    advertCreator,
    engagementEarner,
    engagementCreator,
    fetchUserData,
    loginUser,
    logoutUser,
    signupUser,
    OAuthUser,
    verifyUserEmail,
    getEngagementEarners,
    getAdvertEarners,
    getEngagementCreator,
    getAdvertCreator,
    getAdminData,
  };

  return (
    <AuthContext.Provider value={AuthValue}>
      {loading ? (
        <div>
          <Spinner size={25} />
        </div>
      ) : (
        <div className="font-primary">
          <div className="hide-on-large-screen">{children}</div>
          <div className="hidden bg-white h-screen w-full lg:flex justify-center items-center show-on-large-screen">
            <div
              className="flex flex-col gap-1 justify-center items-center p-3 shadow-2xl rounded"
              style={{ maxWidth: "400px" }}
            >
              <img
                src={deviceNotAllowedImg}
                alt="Not Found Img"
                className="w-52"
              />
              <h3 className="text-red-500 font-bold">Device Not Allowed!</h3>
              <p className="text-gray-400 text-sm text-center">
                This device size is not allowed to view this app.{" "}
              </p>
              <span className="text-xs text-orange-500 font-semibold">
                ONLY MOBILE DEVICES ARE ALLOWED TO VIEW THIS APP
              </span>
              <div className="flex justify-end italic font-bold w-full">
                <h3 className="text-green-500 text-sm">{adminData?.appName}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
