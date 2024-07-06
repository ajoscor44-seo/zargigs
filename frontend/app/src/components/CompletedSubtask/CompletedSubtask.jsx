import React from "react";
import Subtask from "../Subtask/Subtask";
import NoData from "../NoData/NoData";

const CompletedSubtask = ({
  completedSubtasks,
  slug,
  type,
  platform,
  status,
}) => {
  return (
    <div className="font-primary">
      {completedSubtasks?.length ? (
        <div className="tasks">
          {completedSubtasks?.map((completedSubtask, i) => {
            return (
              <Subtask
                key={i}
                task={completedSubtask}
                slug={slug}
                type={type}
                platform={platform}
                status={status}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-300 p-2 gap-2 h-96">
          <NoData
            textBelow={
              "You do not have any COMPLETED task here yet. Your COMPLETED tasks will appear on this page."
            }
          />
        </div>
      )}
    </div>
  );
};

export default CompletedSubtask;
