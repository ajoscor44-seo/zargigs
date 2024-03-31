import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const VerifiedMemberPrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser &&
          currentUser.isEmailVerified &&
          currentUser.gender &&
          currentUser.isMember ? (
          <Component {...props} />
        ) : currentUser &&
          currentUser.isEmailVerified &&
          !currentUser.isMember ? (
          <Redirect to="/become-a-member" />
        ) : currentUser &&
          currentUser.isEmailVerified &&
          currentUser.isMember &&
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

export default VerifiedMemberPrivateRoute;
