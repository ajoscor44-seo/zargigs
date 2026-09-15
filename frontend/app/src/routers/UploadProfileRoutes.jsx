import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const UploadProfilePrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return <Redirect to="/login" />;
        }
        if (currentUser.isBanned) {
          return <Redirect to="/login" />;
        }
        if (!currentUser.isEmailVerified) {
          return <Redirect to="/login" />;
        }
        if (currentUser.gender || currentUser.location || currentUser.state) {
          return <Redirect to="/dashboard" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default UploadProfilePrivateRoute;
