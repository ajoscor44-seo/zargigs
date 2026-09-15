import React from "react";
import ClientDashboard from "./ClientDashboard";
import UploadInfoPage from "./UploadInfoPage";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasCompletedOnboarding = Boolean(currentUser?.location || currentUser?.state);

  return (
    <div>
      {hasCompletedOnboarding ? <ClientDashboard /> : <UploadInfoPage />}
    </div>
  );
};

export default DashboardPage;
