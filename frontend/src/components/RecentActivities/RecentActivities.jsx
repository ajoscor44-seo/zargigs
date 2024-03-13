import React from "react";
import RecentActivity from "../RecentActivity/RecentActivity";

const RecentActivities = ({ recentActivities }) => {
  return (
    <div className="bg-white px-4 py-2 recentactivities mb-12 pb-5 border-t">
      <div className="font-primary mb-2">
        <h2 className="font-bold text-lg">Recent Activities</h2>
        <p className="text-sm text-primary">
          See what Gigflates are doing on Gigsflix
        </p>
      </div>
      <div className="recentActivities">
        {recentActivities.map((recentActivity) => {
          return <RecentActivity recentActivity={recentActivity} />;
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
