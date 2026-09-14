import React from "react";
import RecentActivity from "../RecentActivity/RecentActivity";
import { useAuth } from "../../context/AuthContext";

const RecentActivities = ({ recentActivities }) => {
  const { adminData } = useAuth();
  
  if (!Array.isArray(recentActivities) || recentActivities.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="font-primary pb-2 border-b border-slate-100">
        <h2 className="font-black text-base sm:text-lg text-slate-900">Recent Platform Activities</h2>
        <p className="text-xs text-slate-500">
          Real-time completed tasks and payouts across {adminData?.appName || "Zargigs"}
        </p>
      </div>
      <div className="space-y-2.5">
        {recentActivities.map((recentActivity, idx) => (
          <RecentActivity
            key={recentActivity?._id || recentActivity?.id || idx}
            recentActivity={recentActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;

