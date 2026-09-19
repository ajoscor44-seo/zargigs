import React, { useState } from "react";
import SignupLayout from "../Layouts/SignupLayout";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import PageSlider from "../components/PageSlider/PageSlider";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const { signupUser, loginUser, fetchUserData, adminData, setDashboardMode } = useAuth();
  const history = useHistory();
  const { username } = useParams();
  const [formData, setFormData] = useState({
    accountType: "earner",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    ...(username ? { referredBy: username } : {}),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const pagesData = [
    {
      title: `Create your ${adminData?.appName || "DocsZAR"} Account`,
      info: "Start earning or promote your campaigns in seconds.",
      step: 1,
    },
    {
      title: "Set Handle & Password",
      info: "Choose a unique username and secure password.",
      step: 2,
    },
  ];

  const handleInputError = (currentPage) => {
    if (currentPage === 0) {
      if (!formData.firstname?.trim()) {
        setError("Please enter your firstname");
        return true;
      }
      if (!formData.lastname?.trim()) {
        setError("Please enter your lastname");
        return true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email?.trim() || !emailRegex.test(formData.email.trim())) {
        setError("Please enter a valid email address (e.g. name@example.com)");
        return true;
      }
      if (!formData.phone?.trim()) {
        setError("Please enter your phone number");
        return true;
      }

      const cleanPhone = formData.phone.toString().replace(/\D/g, "");
      if (cleanPhone.length < 10) {
        setError("Phone number must be at least 10 digits.");
        return true;
      }
      if (!formData.referredBy) {
        setFormData((prev) => ({ ...prev, referredBy: "admin" }));
      }
    }

    if (currentPage === 1) {
      if (!formData.username?.trim()) {
        setError("Please choose a unique username");
        return true;
      }
      if (formData.username.trim().length < 3) {
        setError("Username must be at least 3 characters");
        return true;
      }
      if (!formData.password) {
        setError("Please create a password");
        return true;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return true;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return true;
      }
    }
    return false;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cleanEmail = (formData.email || "").trim().toLowerCase();
      const submissionData = {
        ...formData,
        email: cleanEmail,
      };

      const res = await signupUser(submissionData);
      if (res.failed) {
        setIsLoading(false);
        const msg = res.message || "";
        if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("over_email_send_rate_limit")) {
          return setError("Email limit exceeded on server. Please wait a few minutes before trying again.");
        }
        return setError(msg || "An error occurred during registration.");
      }

      if (formData.accountType) {
        setDashboardMode(formData.accountType);
      }

      if (res.requiresVerification) {
        sessionStorage.setItem("auth-user-email", cleanEmail);
        sessionStorage.setItem("auth_pending_email", cleanEmail);
        localStorage.setItem("auth_pending_email", cleanEmail);
        setIsLoading(false);
        return history.push(`/verify-email?email=${encodeURIComponent(cleanEmail)}`);
      }

      sessionStorage.removeItem("auth-user-email");
      sessionStorage.removeItem("auth_pending_email");
      localStorage.removeItem("auth_pending_email");
      try {
        await loginUser(cleanEmail, formData.password);
        await fetchUserData();
        setIsLoading(false);
        return history.push("/dashboard");
      } catch {
        setIsLoading(false);
        return history.push("/login?registered=true");
      }
    } catch (err) {
      setIsLoading(false);
      return setError(err.message || "Failed to complete registration.");
    }
  };

  return (
    <SignupLayout referralUsername={username}>
      <PageSlider
        errorMsg={error}
        setError={setError}
        isLoading={isLoading}
        pages={pagesData}
        formData={formData}
        adminData={adminData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleInputError={handleInputError}
        referralUsername={username}
      />
    </SignupLayout>
  );
};

export default SignUp;
