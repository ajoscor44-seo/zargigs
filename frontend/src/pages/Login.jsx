import React, { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { GrPowerReset } from "react-icons/gr";
import { MdOutlineLogin } from "react-icons/md";
import logo from "../assets/png/logo-color.png";
import loginIllustration from "../assets/images/login-illustration-png.png";
import googleIcon from "../assets/png/google-icon.png";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput/FormInput";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [formData, setFormData] = useState({});
  const { loginUser, currentUser } = useAuth();
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  const submitForm = async () => {
    setIsLoading(true);
    if (!formData.email && !formData.password) {
      setError("No email and password");
      setIsLoading(false);
      return;
    } else if (!formData.email) {
      setError("Please input a email address");
      setIsLoading(false);
      return;
    } else if (!formData.password) {
      setError("Please input your password");
      setIsLoading(false);
      return;
    } else {
      const res = await loginUser(formData.email, formData.password);
      if (res.message) {
        setIsLoading(false);
        return setError(res.message);
      } else {
        setIsLoading(false);
        return resetForm();
      }
    }
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
        {error && (
          <p className="text-center bg-red-200 text-red-500 my-2 mx-4 rounded py-1 font-semibold">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-4 px-4 pb-5">
          <div className="flex flex-col">
            <FormInput
              icon={"email"}
              label={"Email"}
              placeholder={"example@gmail.com"}
              note={"Please input your email address"}
              errorMsg={"Invalid Email"}
              isError={false}
              type={"email"}
              fullRounded={false}
              value={email}
              name={"email"}
              handleChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <FormInput
              icon={"password"}
              label={"Password"}
              placeholder={"********"}
              note={"Please input your password"}
              errorMsg={"Invalid password"}
              isError={false}
              type={"password"}
              fullRounded={false}
              value={password}
              name={"password"}
              handleChange={handleChange}
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
              onClick={submitForm}
            >
              <MdOutlineLogin size={15} className="me-2" />
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
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
