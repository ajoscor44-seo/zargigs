import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser && !currentUser.isEmailVerified ? (
          <Component {...props} />
        ) : currentUser && currentUser.isEmailVerified ? (
          <Redirect to="/set-location" />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
