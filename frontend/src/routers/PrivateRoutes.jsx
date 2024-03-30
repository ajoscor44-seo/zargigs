import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser &&
          currentUser.isEmailVerified &&
          currentUser.gender ? (
          <Component {...props} />
        ) : currentUser &&
          currentUser.isEmailVerified &&
          !currentUser.gender ? (
          <Redirect to="/input-user-info" />
        ) : currentUser && !currentUser.isEmailVerified ? (
          <Redirect to="/login" />
        ) : (
          <Redirect to="/signup" />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
