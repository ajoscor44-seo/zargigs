import React, { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaFacebook } from "react-icons/fa6";
import { GrGoogle, GrPowerReset } from "react-icons/gr";
import { MdOutlineLogin } from "react-icons/md";
import logo from "../assets/png/logo-color.png";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("No email or password");
      return;
    }
    console.log(`Email: ${email}`, `Password: ${password}`);
  };

  return (
    <div className="bg-white px-4 py-10">
      <div className="flex items-center gap-2 px-4">
        <img className="w-10 rounded" src={logo} />

        <div className="flex items-start flex-col">
          <h2 className="text-2xl font-primary font-bold">GigsFlix</h2>
          <span className="h-1 w-6 rounded-full bg-primaryLight"></span>
        </div>
      </div>

      <div>
        <p className="font-bold font-primary mt-4 px-4 text-lg">
          Welcome back! 👋
        </p>
        <p className="font-normal font-primary mt-2 px-4 text-md">
          Fill the fields below to log into your account.
        </p>
        <form
          onSubmit={(e) => submitForm(e)}
          className="flex flex-col gap-4 px-4 py-5"
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
              className="btn rounded bg-red-500 text-white font-primary font-bold flex items-center"
              onClick={resetForm}
            >
              <GrPowerReset size={15} className="me-2" />
              Reset
            </button>
            <button className="btn rounded bg-primaryLight text-white font-primary font-bold flex items-center">
              <MdOutlineLogin size={15} className="me-2" />
              Login
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-4 px-4">
          <div className="btn rounded-sm flex justify-center items-center gap-2 font-primary text-red-600 border mt-3">
            <GrGoogle size={20} />
            <span className="text-xl text-dark">Continue With Google</span>
          </div>
          <div className="btn rounded-sm flex justify-center items-center gap-2 font-primary text-blue-600 border mt-3">
            <FaFacebook size={20} />
            <span className="text-xl text-dark">Continue With Facebook</span>
          </div>
          <Link to="/forgot-password">
            <p className="flex justify-center text-primary hover:text-primaryLight">
              Forgot Password
            </p>
          </Link>
          <p className="flex justify-center">
            Don't have an account?
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
