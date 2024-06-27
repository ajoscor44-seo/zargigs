import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { GrPowerReset } from "react-icons/gr";
import { MdOutlineLogin } from "react-icons/md";
import loginIllustration from "../assets/images/login-illustration-png.png";
import FormInput from "../components/FormInput/FormInput";
import { useAuth } from "../context/AuthContext";
import OAuth from "../components/OAuth/OAuth";

const Login = ({ setNotVerified }) => {
  const [email, setEmail] = useState(null);
  const [formData, setFormData] = useState({});
  const { loginUser, fetchUserData, adminData } = useAuth();
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  const submitForm = async () => {
    try {
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

        if (
          res.failed &&
          res.message == "Please verify your email to continue."
        ) {
          setIsLoading(false);
          setError(res.message);
          sessionStorage.setItem("auth-user-email", formData.email);
          return setNotVerified(true);
        }
        if (res.failed) {
          setIsLoading(false);
          return setError(res.message);
        } else {
          setIsLoading(false);
          setError(null);
          sessionStorage.removeItem("auth-user-email");
          resetForm();
          await fetchUserData();
          return history.push("/");
        }
      }
    } catch (error) {
      setIsLoading(false);
      return setError(error.message);
    }
  };

  return (
    <div className="bg-white px-4 py-10 lg:py-0 lg:flex max-h-screen overflow-hidden">
      <div className="lg:flex lg:flex-col lg:py-5 flex-1">
        <div className="flex items-center gap-2 px-4">
          <img className="w-10 rounded" src={adminData?.appLogo} />
          <div className="flex items-start flex-col">
            <h2 className="text-2xl font-primary font-bold">
              {adminData?.appName}
            </h2>
            <span className="h-1 w-6 rounded-full bg-green-500"></span>
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
              className="btn rounded bg-green-500 text-white font-primary font-bold flex items-center"
              onClick={submitForm}
            >
              <MdOutlineLogin size={15} className="me-2" />
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4">
          <OAuth setError={setError} />
          <Link to="/forgot-password">
            <p className="flex justify-center text-primary hover:text-green-500">
              Forgot Password
            </p>
          </Link>
          <p className="flex justify-center">
            Dont have an account?
            <Link to="/signup">
              <span className="text-primary hover:text-green-500 ms-1">
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
