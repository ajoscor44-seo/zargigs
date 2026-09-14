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
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <NoData
            textBelow={
              "You have not completed any tasks in this category yet. Your completed tasks and earnings will appear here."
            }
          />
        </div>
      )}
    </div>
  );
};

export default CompletedSubtask;
