import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
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
        if (!currentUser.gender && !currentUser.state && !currentUser.location) {
          return <Redirect to="/input-user-info" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
