import React from "react";
import logo from "../assets/png/logo-color.png";
import { Link } from "react-router-dom/cjs/react-router-dom";
import OAuth from "../components/OAuth/OAuth";
import { useAuth } from "../context/AuthContext";

const SignupLayout = ({ children }) => {
  const { adminData } = useAuth();

  return (
    <div
      className="flex flex-col rounded p-4"
      style={{ maxHeight: "100vh", width: "100%", maxWidth: "400px" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <img className="w-10 rounded" src={logo} />
        <div className="flex items-start flex-col">
          <h2 className="text-2xl font-primary font-bold">
            {adminData?.appName}
          </h2>
          <span className="h-1 w-6 rounded-full bg-green-500"></span>
        </div>
      </div>
      {children}
      <OAuth />
      <div className="flex flex-col justify-center bg-white items-center">
        <p className="text-center text-sm px-8 mx-4 mt-5">
          By signing up, you agree to our{" "}
          <Link to="/terms">
            <span className="text-primary font-semibold hover:underline">
              Terms and Privacy Policy
            </span>
          </Link>
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-600">
            Already have an account on {adminData?.appName}?
          </p>
          <Link to="/login">
            <span className="text-green-500 text-xs font-semibold hover:underline">
              LOG IN NOW
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupLayout;
