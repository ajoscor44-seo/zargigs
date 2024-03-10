import React from "react";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientWelcomeMsg from "../components/ClientWelcomeMsg/ClientWelcomeMsg";
import ClientDashboardCard from "../components/ClientDashboardCard/ClientDashboardCard";
import ClientsEarnings from "../components/ClientEarnings/ClientsEarnings";
import MoneyTransaction from "../components/MoneyTransaction/MoneyTransaction";
import EarningMethods from "../components/EarningMethods/EarningMethods";
import RecentActivities from "../components/RecentActivities/RecentActivities";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import user from "../data/user";
import recentActivities from "../data/recentActivities";

const ClientDashboard = () => {
  return (
    <div className="clientDashboard bg-slate-50">
      <ClientNavbar />
      <ClientWelcomeMsg username={user.username} />
      <ClientDashboardCard
        firstname={user.firstname}
        lastname={user.lastname}
        userBalance={user.balance}
      />
      <MoneyTransaction />
      <ClientsEarnings
        totalEarnings={user.totalEarnings}
        pendingEarnings={user.pendingEarnings}
        amountWithdrawn={user.amountWithdrawn}
        amountSpent={user.amountSpent}
      />
      <EarningMethods />
      <RecentActivities recentActivities={recentActivities} />
      <ClientMenuBar />
    </div>
  );
};

export default ClientDashboard;
