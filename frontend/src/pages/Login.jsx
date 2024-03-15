import React, { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { GrPowerReset } from "react-icons/gr";
import { MdOutlineLogin } from "react-icons/md";
import logo from "../assets/png/logo-color.png";
import loginIllustration from "../assets/images/login-illustration-png.png";
import googleIcon from "../assets/png/google-icon.png";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const login = async () => {
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
      setIsLoading(false);
      return data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email && !password) {
      setError("No email and password");
      setIsLoading(false);
      return;
    } else if (!email) {
      setError("Please input a email address");
      setIsLoading(false);
      return;
    } else if (!password) {
      setError("Please input your password");
      setIsLoading(false);
      return;
    } else {
      const currentUser = await login();
      setError(null);
      setIsLoading(false);
    }
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-white px-4 py-10 lg:py-0 lg:flex max-h-screen overflow-hidden">
      <div className="lg:flex lg:flex-col lg:py-5 flex-1">
        <div className="flex items-center gap-2 px-4">
          <img className="w-10 rounded" src={logo} />
          <div className="flex items-start flex-col">
            <h2 className="text-2xl font-primary font-bold">GigsFlix</h2>
            <span className="h-1 w-6 rounded-full bg-primaryLight"></span>
          </div>
        </div>
        <div className="col-span-2 hidden lg:flex lg:justify-center">
          <img src={loginIllustration} className="h-svh" />
        </div>
      </div>

      <div className="lg:bg-slate-50 lg:p-10 lg:pt-20">
        <p className="font-bold font-primary mt-4 px-4 text-lg">
          Welcome back! 👋
        </p>
        <p className="font-normal font-primary mt-2 px-4 text-md">
          Fill the fields below to log into your account.
        </p>
        <p className="text-center text-red-500 py-3 font-semibold">{error}</p>
        <form
          onSubmit={(e) => submitForm(e)}
          className="flex flex-col gap-4 px-4 pb-5"
        >
          <div className="flex flex-col">
            <span className="text-primaryLight text-lg mb-1 font-primary font-medium">
              Email:
            </span>
            <input
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded outline-primaryLight"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-primaryLight text-lg mb-1 font-primary font-medium">
              Password:
            </span>
            <input
              type="password"
              placeholder="********"
              value={password}
              className="border p-3 rounded outline-primaryLight"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex gap-4 justify-end">
            <button
              disabled={isLoading}
              className="btn rounded bg-red-500 text-white font-primary font-bold flex items-center"
              onClick={resetForm}
            >
              <GrPowerReset size={15} className="me-2" />
              Reset
            </button>
            <button
              disabled={isLoading}
              className="btn rounded bg-primaryLight text-white font-primary font-bold flex items-center"
            >
              <MdOutlineLogin size={15} className="me-2" />
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-4 px-4">
          <div className="btn rounded-sm flex justify-center items-center gap-2 font-primary text-red-600 border mt-3">
            <img src={googleIcon} className="w-8" />
            <span className="text-xl text-dark">Continue With Google</span>
          </div>
          <Link to="/forgot-password">
            <p className="flex justify-center text-primary hover:text-primaryLight">
              Forgot Password
            </p>
          </Link>
          <p className="flex justify-center">
            Dont have an account?
            <Link to="/signup">
              <span className="text-primary hover:text-primaryLight ms-1">
                {" "}
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
