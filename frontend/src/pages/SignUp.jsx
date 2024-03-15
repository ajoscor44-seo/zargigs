import React, { useState } from "react";
import SignupLayout from "../Layouts/SignupLayout";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom";
import PageSlider from "../components/PageSlider/PageSlider";

const SignUp = () => {
  const params = useParams();
  const pagesData = [
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
          defaultValue: "",
          name: "firstname",
        },
        {
          label: "Lastname",
          note: "Ensure your names are in the correct order",
          placeholder: "Enter Your Lastname",
          icon: "user",
          type: "text",
          error: "An error occurred here",
          isError: false,
          defaultValue: "",
          name: "lastname",
        },
        {
          label: "Referrer's Username (Optional)",
          note: "Please enter the username of the person who referred you to Gigsflix. You can leave this empty if you wish.",
          placeholder: "Enter Your Referrer's Username",
          icon: "referrer",
          type: "text",
          error: "An error occurred here",
          isError: false,
          defaultValue: params?.username,
          name: "referredBy",
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
          defaultValue: "",
          name: "username",
        },
        {
          label: "Email",
          note: "",
          placeholder: "Email",
          icon: "email",
          type: "email",
          error: "An error occurred here",
          isError: false,
          defaultValue: "",
          name: "email",
        },
        {
          label: "Password",
          note: "Password must contain atleast 6 Characters",
          placeholder: "Password",
          icon: "password",
          type: "password",
          error: "An error occurred here",
          isError: false,
          defaultValue: "",
          name: "password",
        },
      ],
    },
  ];
  const [formData, setFormData] = useState({
    isMember: false,
    isEmailVerified: false,
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState(pagesData);

  const handleInputError = (currentPage) => {
    if (currentPage == 0) {
      if (!formData.firstname) {
        setError("Please input firstname");
        return true;
      }
      if (!formData.lastname) {
        setError("Please input lastname");
        return true;
      }
      if (!formData.referredBy) {
        setFormData({ ...formData, referredBy: "admin" });
      }
    }

    if (currentPage == pages.length - 1) {
      if (!formData.username) {
        setError("Please input username");
        return true;
      }
      if (!formData.email) {
        setError("Please input an email");
        return true;
      }
      if (!formData.password) {
        setError("Please input a password");
        return true;
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (
        data.message.includes(`dup key: { username: "${formData.username}" }`)
      ) {
        setError(`Username: ${formData.username} already exists.`);
      } else if (
        data.message.includes(`dup key: { email: "${formData.email}" }`)
      ) {
        setError(`Email: ${formData.email} already exists.`);
      } else {
        setError(null);
        setPages(pagesData);
      }
      setIsLoading(false);
    } catch (error) {
      return;
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center font-primary"
      style={{ height: "100vh" }}
    >
      <SignupLayout>
        <div className="flex-1 border py-5 rounded-sm">
          <PageSlider
            errorMsg={error}
            setError={setError}
            isLoading={isLoading}
            pages={pages}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleInputError={handleInputError}
          />
        </div>
      </SignupLayout>
    </div>
  );
};

export default SignUp;
