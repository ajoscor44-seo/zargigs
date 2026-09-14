import React, { useEffect, useState } from "react";
import SignupLayout from "../Layouts/SignupLayout";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import PageSlider from "../components/PageSlider/PageSlider";
import { useAuth } from "../context/AuthContext";

const SignUp = ({ setSignedIn }) => {
  const { signupUser, loginUser, fetchUserData, adminData, setDashboardMode } = useAuth();
  const history = useHistory();
  const { username } = useParams();
  const [formData, setFormData] = useState({
    accountType: "earner",
    ...(username ? { referredBy: username } : {}),
  });
  const pagesData = [
    {
      bgColor: "bg-white",
      title: `Sign Up on ${adminData?.appName || "DocsZar"}`,
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
          note: `Please enter the username of the person who referred you to ${adminData?.appName || "DocsZar"}. You can leave this empty if you wish.`,
          placeholder: "Enter Your Referrer's Username",
          icon: "referrer",
          type: "text",
          error: "An error occurred here",
          isError: false,
          value: username || formData.referredBy || "",
          name: "referredBy",
          disabled: !!username,
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
          value: formData.username || "",
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
          value: formData.email || "",
          name: "email",
        },
        {
          label: "Phone No",
          note: "Please input your 10-digit registered phone number (without leading 0).",
          placeholder: "8012345678",
          icon: "phone",
          type: "tel",
          error: "An error occurred here",
          isError: false,
          value: formData.phone || "",
          name: "phone",
          maxLength: 10,
        },
      ],
    },
    {
      bgColor: "bg-white",
      title: "Security & Access",
      info: "Create a secure password for your account.",
      formInputs: [
        {
          label: "Password",
          note: "Password must contain at least 6 characters",
          placeholder: "Enter Password",
          icon: "password",
          type: "password",
          error: "An error occurred here",
          isError: false,
          value: formData.password || "",
          name: "password",
        },
        {
          label: "Confirm Password",
          note: "Re-enter your password to confirm",
          placeholder: "Confirm Password",
          icon: "password",
          type: "password",
          error: "An error occurred here",
          isError: false,
          value: formData.confirmPassword || "",
          name: "confirmPassword",
        },
      ],
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pages = pagesData;

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
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await signupUser(formData);
      if (res.failed) {
        setIsLoading(false);
        return setError(
          res.message || "An error occurred. Please try again later."
        );
      } else {
        setError(null);
        if (formData.accountType) {
          setDashboardMode(formData.accountType);
        }

        if (res.requiresVerification) {
          sessionStorage.setItem("auth-user-email", formData.email.trim());
          setIsLoading(false);
          return history.push("/verify-email");
        }

        sessionStorage.removeItem("auth-user-email");
        try {
          await loginUser(formData.email.trim(), formData.password);
          await fetchUserData();
          setIsLoading(false);
          return history.push("/dashboard");
        } catch (loginErr) {
          setIsLoading(false);
          return history.push("/login?registered=true");
        }
      }
    } catch (error) {
      setIsLoading(false);
      return setError(error.message || "An error occurred during registration.");
    }
  };

  return (
    <SignupLayout referralUsername={username}>
      <PageSlider
        errorMsg={error}
        setError={setError}
        isLoading={isLoading}
        pages={pages}
        formData={formData}
        adminData={adminData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleInputError={handleInputError}
      />
    </SignupLayout>
  );
};

export default SignUp;
