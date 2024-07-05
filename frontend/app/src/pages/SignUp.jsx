import React, { useEffect, useState } from "react";
import SignupLayout from "../Layouts/SignupLayout";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import PageSlider from "../components/PageSlider/PageSlider";
import { useAuth } from "../context/AuthContext";

const SignUp = ({ setSignedIn }) => {
  const { signupUser, adminData } = useAuth();
  const { username } = useParams();
  const [formData, setFormData] = useState(
    username ? { referredBy: username } : {}
  );
  const pagesData = [
    {
      bgColor: "bg-white",
      title: `Sign Up on ${adminData?.appName || "Gigsflix"}`,
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
          value: formData.firstname,
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
          value: formData.lastname,
          name: "lastname",
        },
        {
          label: "Referrer's Username (Optional)",
          note: `Please enter the username of the person who referred you to ${adminData?.appName}. You can leave this empty if you wish.`,
          placeholder: "Enter Your Referrer's Username",
          icon: "referrer",
          type: "text",
          error: "An error occurred here",
          isError: false,
          value: username || formData.referredBy,
          name: "referredBy",
        },
      ],
    },
    {
      bgColor: "bg-white",
      title: "Almost Done!",
      info: "Make your account unique.",
      formInputs: [
        {
          label: "Username",
          note: "Your username is also your handle. Make sure you create something unique and interesting",
          placeholder: "Enter Your Username",
          icon: "user",
          type: "text",
          error: "An error occurred here",
          isError: false,
          value: formData.username,
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
          value: formData.email,
          name: "email",
        },
        {
          label: "Phone No",
          note: "Please input your registered phone.",
          placeholder: "8012345678",
          icon: "phone",
          type: "tel",
          error: "An error occurred here",
          isError: false,
          value: formData.phone,
          name: "phone",
          maxLength: 10,
        },
      ],
    },
    {
      bgColor: "bg-white",
      title: "Last Lap!",
      info: "Make your account solely yours.",
      formInputs: [
        {
          label: "Password",
          note: "Password must contain atleast 6 Characters",
          placeholder: "Password",
          icon: "password",
          type: "password",
          error: "An error occurred here",
          isError: false,
          value: formData.password,
          name: "password",
        },
        {
          label: "Confirm Password",
          note: "Password must contain atleast 6 Characters",
          placeholder: "Confirm Password",
          icon: "password",
          type: "password",
          error: "An error occurred here",
          isError: false,
          value: formData.confirmPassword,
          name: "confirmPassword",
        },
      ],
    },
  ];
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

    if (currentPage == 1) {
      if (!formData.username) {
        setError("Please input username");
        return true;
      }
      if (!formData.email) {
        setError("Please input an email");
        return true;
      }
      if (formData.phone.toString().startsWith("0")) {
        setError("First '0' in phone no. is not needed");
        return true;
      }
      if (formData.phone.toString().length !== 10) {
        setError("Phone number must be 10 characters long.");
        return true;
      }

      let invalidChar = false;

      for (let i = 0; i < formData.phone.toString().length; i++) {
        const element = formData.phone.toString()[i];
        const numbers = "1234567890";
        if (!numbers.includes(element)) {
          invalidChar = true;
          break;
        }
      }
      if (invalidChar) {
        setError("Input a valid phone number");
        return true;
      }
    }

    if (currentPage == pages.length - 1) {
      if (!formData.password) {
        setError("Please input a password");
        return true;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
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
      const res = await signupUser(formData);
      setIsLoading(false);
      if (res.failed) {
        return setError(
          res.message || "An error occurred. Please try again later."
        );
      } else {
        setError(null);
        setPages(pagesData);
        setSignedIn(formData.email);
        sessionStorage.setItem("auth-user-email", formData.email);
        return;
      }
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center font-primary"
      style={{ height: "100vh" }}
    >
      <SignupLayout>
        <div className="w-auto flex-1 border py-5 rounded-sm">
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
