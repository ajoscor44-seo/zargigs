import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const UploadProfilePrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser &&
          currentUser.isEmailVerified &&
          !currentUser.location &&
          !currentUser.religion ? (
          <Component {...props} />
        ) : currentUser &&
          currentUser.isEmailVerified &&
          currentUser.location &&
          currentUser.religion ? (
          <Redirect to="/" />
        ) : (
          <Redirect to="/signup" />
        );
      }}
    ></Route>
  );
};

export default UploadProfilePrivateRoute;
