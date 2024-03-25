import React from "react";
import ClientDashboard from "./ClientDashboard";
import UploadInfoPage from "./UploadInfoPage";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { currentUser } = useAuth();
  return (
    <div>{currentUser.location ? <ClientDashboard /> : <UploadInfoPage />}</div>
  );
};

export default DashboardPage;
