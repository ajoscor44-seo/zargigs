import React, { useEffect, useState } from "react";
import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import ClientWelcomeMsg from "../components/ClientWelcomeMsg/ClientWelcomeMsg";
import ClientDashboardCard from "../components/ClientDashboardCard/ClientDashboardCard";
import ClientsEarnings from "../components/ClientEarnings/ClientsEarnings";
import MoneyTransaction from "../components/MoneyTransaction/MoneyTransaction";
import EarningMethods from "../components/EarningMethods/EarningMethods";
import RecentActivities from "../components/RecentActivities/RecentActivities";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import WhatTheyCanDo from "../components/WhatTheyCanDo/WhatTheyCanDo";
import { useAuth } from "../context/AuthContext";

const ClientDashboard = () => {
  const { currentUser, userToken } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetches the recent activities
  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/activities/recent-activities",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await response.json();
      setRecentActivities(data);
      return data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const possibleActions = [
    {
      personnel: "Advertisers",
      title: "Get People to Post Your Adverts on their Social Media",
      description:
        "Get people with aleast 1,000 followers to post your adverts and perform social engagement tasks for you on their social media account.",
      btnText: "Get Started Now",
      path: "/advertise",
    },
    {
      personnel: "Earners",
      title: "Get Paid for Posting Adverts on Your Social Media",
      description:
        "Earn steady income by reselling products and posting adverts and performing social tasks for businesses and top brands on your social media account.",
      btnText: "Become A Member",
      path: "/become-a-member",
    },
  ];

  return (
    <div className="clientDashboard bg-slate-50">
      <ClientNavbar />
      {currentUser.isMember ? (
        <div className="block">
          <ClientWelcomeMsg username={currentUser.username} />
          <ClientDashboardCard
            firstname={currentUser.firstname}
            lastname={currentUser.lastname}
            userBalance={currentUser.balance}
          />
          <MoneyTransaction />
          <ClientsEarnings
            totalEarnings={currentUser.totalEarnings}
            pendingEarnings={currentUser.pendingEarnings}
            amountWithdrawn={currentUser.amountWithdrawn}
            amountSpent={currentUser.amountSpent}
          />
          <EarningMethods />
        </div>
      ) : (
        <div className="underBackNav bg-white flex flex-col py-12 px-12 font-primary">
          <div className="mt-5 text-center py-5">
            <h2 className="font-extrabold text-2xl">Welcome to Gigsflix</h2>
            <p className="text-xs">
              Please select what you want to do on Gigsflix today
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {possibleActions.map((action) => {
              return (
                <WhatTheyCanDo
                  key={action.personnel}
                  btnText={action.btnText}
                  actionDesription={action.description}
                  actionPersonnel={action.personnel}
                  actionTitle={action.title}
                  pathTo={action.path}
                />
              );
            })}
          </div>
        </div>
      )}
      {recentActivities.length && (
        <RecentActivities recentActivities={recentActivities} />
      )}
      <ClientMenuBar />
    </div>
  );
};

export default ClientDashboard;
