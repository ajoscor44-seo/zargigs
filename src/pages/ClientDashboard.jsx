import React from "react";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientWelcomeMsg from "../components/ClientWelcomeMsg/ClientWelcomeMsg";
import ClientDashboardCard from "../components/ClientDashboardCard/ClientDashboardCard";
import ClientsEarnings from "../components/ClientEarnings/ClientsEarnings";
import MoneyTransaction from "../components/MoneyTransaction/MoneyTransaction";
import EarningMethods from "../components/EarningMethods/EarningMethods";
import RecentActivities from "../components/RecentActivities/RecentActivities";
import facebookIcon from "../assets/png/facebook_icon.png";
import tiktokIcon from "../assets/png/tiktok-icon.png";
import instagramIcon from "../assets/png/instagram-icon.png";
import googlePlayIcon from "../assets/png/google-play-icon.png";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const ClientDashboard = () => {
  const username = "Xavier";
  const firstname = "Pablo";
  const lastname = "Richie";
  const totalEarnings = 1500000;
  const pendingEarnings = 120000;
  const amountSpent = 90000;
  const amountWithdrawn = 320000;
  const balance = totalEarnings - amountWithdrawn;
  const recentActivities = [
    {
      icon: googlePlayIcon,
      category: "Playstore",
      username: "Zaidu",
      userLocation: {
        LGA: "Akure",
        state: "Ondo",
      },
      amountEarned: 100,
      taskType: "review",
      taskPlatform: "Google Playstore",
    },
    {
      icon: tiktokIcon,
      category: "Tiktok",
      username: "Moscow-P",
      userLocation: {
        LGA: "Abeokuta",
        state: "Ogun",
      },
      amountEarned: 20,
      taskType: "like",
      taskPlatform: "Tiktok",
    },
    {
      icon: instagramIcon,
      category: "Instagram",
      username: "BigDave",
      userLocation: {
        LGA: "Maiduguri",
        state: "Bornu",
      },
      amountEarned: 30,
      taskType: "comment",
      taskPlatform: "Instagram",
    },
    {
      icon: facebookIcon,
      category: "Facebook",
      username: "DML",
      userLocation: {
        LGA: "Ibadan",
        state: "Oyo",
      },
      amountEarned: 50,
      taskType: "share",
      taskPlatform: "Facebook",
    },
  ];

  return (
    <div className="clientDashboard bg-slate-50">
      <ClientNavbar />
      <ClientWelcomeMsg username={username} />
      <ClientDashboardCard
        firstname={firstname}
        lastname={lastname}
        userBalance={balance}
      />
      <MoneyTransaction />
      <ClientsEarnings
        totalEarnings={totalEarnings}
        pendingEarnings={pendingEarnings}
        amountWithdrawn={amountWithdrawn}
        amountSpent={amountSpent}
      />
      <EarningMethods />
      <RecentActivities recentActivities={recentActivities} />
      <ClientMenuBar />
    </div>
  );
};

export default ClientDashboard;
