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
import WhatTheyCanDo from "../components/WhatTheyCanDo/WhatTheyCanDo";

const ClientDashboard = () => {
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
      {user.isMember ? (
        <div className="block">
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
      <RecentActivities recentActivities={recentActivities} />
      <ClientMenuBar />
    </div>
  );
};

export default ClientDashboard;
