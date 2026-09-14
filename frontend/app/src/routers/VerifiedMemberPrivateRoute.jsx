import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const VerifiedMemberPrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return <Redirect to="/signup" />;
        }
        if (currentUser.isBanned) {
          return <Redirect to="/login" />;
        }
        if (!currentUser.isEmailVerified) {
          return <Redirect to="/login" />;
        }
        if (!currentUser.gender) {
          return <Redirect to="/input-user-info" />;
        }
        if (!currentUser.isMember) {
          return <Redirect to="/become-a-member" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default VerifiedMemberPrivateRoute;
