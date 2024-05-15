import React from "react";
import RecentActivity from "../RecentActivity/RecentActivity";
import { useAuth } from "../../context/AuthContext";

const RecentActivities = ({ recentActivities }) => {
  const { adminData } = useAuth()
  
  return (
    <div className="bg-white px-4 py-2 recentactivities mb-12 pb-5 border-t">
      <div className="font-primary mb-2">
        <h2 className="font-bold text-lg">Recent Activities</h2>
        <p className="text-sm text-primary">
          See what Gigflates are doing on {adminData?.appName}
        </p>
      </div>
      <div className="recentActivities">
        {recentActivities.map((recentActivity) => {
          return (
            <RecentActivity
              key={recentActivity._id}
              recentActivity={recentActivity}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
