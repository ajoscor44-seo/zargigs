import React, { useState } from "react";
import SignupLayout from "../Layouts/SignupLayout";
import { Link } from "react-router-dom/cjs/react-router-dom";
import PageSlider from "../components/PageSlider/PageSlider";

const SignUp = () => {
  const [pages, setPages] = useState([
    {
      bgColor: "bg-white",
      title: "Sign Up on Gigsflix",
      info: "Registration is simple, fast and free!",
      formInputs: [
        {
          label: "Firstname",
          note: "Ensure your names are in the correct order",
          placeholder: "Enter Your Firstname",
          icon: "user",
          type: "text",
          error: "An error occurred here",
          isError: false,
        },
        {
          label: "Lastname",
          note: "Ensure your names are in the correct order",
          placeholder: "Enter Your Lastname",
          icon: "user",
          type: "text",
          error: "An error occurred here",
          isError: false,
        },
        {
          label: "Referrer's Username (Optional)",
          note: "Please enter the username of the person who referred you to Gigsflix. You can leave this empty if you wish.",
          placeholder: "Enter Your Referrer's Username",
          icon: "referrer",
          type: "text",
          error: "An error occurred here",
          isError: false,
        },
      ],
    },
    {
      bgColor: "bg-white",
      title: "Almost Done!",
      info: "Make your account solely yours.",
      formInputs: [
        {
          label: "Username",
          note: "Your username is also your handle. Make sure you create something unique and interesting",
          placeholder: "Enter Your Username",
          icon: "user",
          type: "text",
          error: "An error occurred here",
          isError: false,
        },
        {
          label: "Email",
          note: "",
          placeholder: "Email",
          icon: "email",
          type: "email",
          error: "An error occurred here",
          isError: false,
        },
        {
          label: "Password",
          note: "Password must contain atleast 6 Characters",
          placeholder: "Password",
          icon: "password",
          type: "password",
          error: "An error occurred here",
          isError: false,
        },
      ],
    },
  ]);

  return (
    <div
      className="flex flex-col justify-center items-center font-primary"
      style={{ height: "100vh" }}
    >
      <SignupLayout>
        <div className="flex-1 border py-5 rounded-sm">
          <PageSlider pages={pages} />
        </div>
      </SignupLayout>
    </div>
  );
};

export default SignUp;
