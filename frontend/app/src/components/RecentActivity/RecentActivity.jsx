import React from "react";
import ItemIcon from "../ItemIcon/ItemIcon";

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
        <ItemIcon
          platform={recentActivity?.category}
          size={45}
          playstoreSize={"w-20 h-20"}
        />
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
