import React from "react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const MemberPrivateRoute = ({ component: Component, ...rest }) => {
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
        const hasCompletedOnboarding = Boolean(
          currentUser.gender ||
          currentUser.state ||
          currentUser.location ||
          currentUser.completed_onboarding ||
          currentUser.user_metadata?.completed_onboarding
        );
        if (!hasCompletedOnboarding) {
          return <Redirect to="/input-user-info" />;
        }
        if (currentUser.isMember) {
          return <Redirect to="/dashboard" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default MemberPrivateRoute;
