import React, { useState } from "react";
import logo from "../assets/png/logo-color.png";
import { Link } from "react-router-dom/cjs/react-router-dom";
import googleIcon from "../assets/png/google-icon.png";

const SignupLayout = ({ children }) => {
  return (
    <div
      className="flex flex-col rounded p-4"
      style={{ maxHeight: "100vh", width: "100%", maxWidth: "400px" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <img className="w-10 rounded" src={logo} />
        <div className="flex items-start flex-col">
          <h2 className="text-2xl font-primary font-bold">GigsFlix</h2>
          <span className="h-1 w-6 rounded-full bg-primaryLight"></span>
        </div>
      </div>
      {children}
      <div className="btn rounded-sm flex justify-center items-center gap-2 font-primary text-red-600 border mt-3">
        <img src={googleIcon} className="w-8" />
        <span className="text-xl text-dark">Continue With Google</span>
      </div>
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
            Already have an account on Gigsflix?
          </p>
          <Link to="/login">
            <span className="text-primaryLight text-xs font-semibold hover:underline">
              LOG IN NOW
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupLayout;
