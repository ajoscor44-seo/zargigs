import React from "react";

const RecentActivity = ({ recentActivity }) => {
  const taskDone =
    recentActivity.taskType === "review"
      ? "reviewing an app"
      : recentActivity.taskType === "like"
      ? "liking a post"
      : recentActivity.taskType === "comment"
      ? "commenting on a post"
      : "sharing a post";

  return (
    <div className="border bg-white hover:bg-slate-100 p-2 grid grid-flow-col gap-2">
      <div className="activityIcon">
        <img className="w-10" src={recentActivity.icon} />
      </div>
      <div className="activityInfo font-primary">
        <h3 className="font-bold text-md">{recentActivity.category}</h3>
        <p className="text-sm">
          @{recentActivity.username} from{" "}
          <span className="text-primary font-semibold">
            {recentActivity.userLocation.LGA},{" "}
            {recentActivity.userLocation.state}
          </span>{" "}
          just earned{" "}
          <span className="font-bold">₦{recentActivity.amountEarned}</span> for{" "}
          {taskDone} on {recentActivity.taskPlatform}
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;
