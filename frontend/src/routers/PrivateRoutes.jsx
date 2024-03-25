import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { userToken, currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser &&
          currentUser.isEmailVerified &&
          currentUser.location &&
          currentUser.religion ? (
          <Component {...props} />
        ) : currentUser && !currentUser.isEmailVerified ? (
          <Redirect to="/login" />
        ) : currentUser &&
          currentUser.isEmailVerified &&
          !currentUser.location &&
          !currentUser.religion ? (
          <Redirect to="/input-user-info" />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
