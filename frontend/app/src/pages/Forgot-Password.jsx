import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState();

  return (
    <div className="flex justify-center items-center border py-10">
      <div className="flex flex-col shadow mx-5 p-3 border rounded bg-white">
        <h2>Forgot Password</h2>
        <p>Input your email address into the field below.</p>
        <div className="flex flex-col">
          <span className="text-green-500 text-lg mb-1 font-primary font-medium">
            Email:
          </span>
          <input
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded outline-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
