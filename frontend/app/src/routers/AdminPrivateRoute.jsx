import React from "react";
import { Route, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../context/AuthContext";

const AdminPrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return <Redirect to="/login" />;
        }
        if (currentUser.role !== "admin") {
          return <Redirect to="/dashboard" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default AdminPrivateRoute;
