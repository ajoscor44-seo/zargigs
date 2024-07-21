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
import axios from "axios";
import Announcements from "../components/Announcements/Announcements";
import Advertisements from "../components/Advertisements/Advertisements";

const ClientDashboard = () => {
  const { currentUser, adminData } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetches the recent activities
  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get("/api/v1/activities/recent-activities");
      const data = await response.data;

      if (data.failed) {
        return console.error(data.message);
      }
      setRecentActivities(data);
      return data;
    } catch (error) {
      return error;
    }
  };

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
      <div className="mb-10">
        <div>
          {currentUser.isMember ? (
            <div className="block">
              <ClientWelcomeMsg username={currentUser.username} />
              <Announcements />
              <Advertisements />
              <ClientDashboardCard
                firstname={currentUser.firstname}
                lastname={currentUser.lastname}
                userBalance={currentUser.userEarnings.balance}
              />
              <MoneyTransaction />
              <ClientsEarnings
                totalEarnings={currentUser.userEarnings.totalEarnings}
                pendingEarnings={currentUser.userEarnings.pendingEarnings}
                amountWithdrawn={currentUser.userEarnings.amountWithdrawn}
                amountSpent={currentUser.userEarnings.amountSpent}
              />
              <EarningMethods />
            </div>
          ) : (
            <div className="underBackNav bg-white flex flex-col py-12 px-12 font-primary">
              <div className="mt-5 text-center py-5">
                <h2 className="font-extrabold text-2xl">
                  Welcome to {adminData?.appName}
                </h2>
                <p className="text-xs">
                  Please select what you want to do on {adminData?.appName}{" "}
                  today
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
        </div>
        {recentActivities.length && (
          <RecentActivities
            key={recentActivities.id}
            recentActivities={recentActivities}
          />
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default ClientDashboard;
