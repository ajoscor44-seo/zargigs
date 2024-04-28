import React from "react";
import Subtask from "../Subtask/Subtask";
import NoData from "../NoData/NoData";

const InReviewSubtask = ({
  inReviewSubtasks,
  slug,
  platform,
  status,
  type,
}) => {
  return (
    <div className="font-primary">
      {inReviewSubtasks?.length ? (
        <div className="tasks">
          {inReviewSubtasks.map((inReviewSubtask) => {
            return (
              <Subtask
                task={inReviewSubtask}
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
              "You do not have any IN REVIEW task here yet. Your IN REVIEW tasks will appear on this page."
            }
          />
        </div>
      )}
    </div>
  );
};

export default InReviewSubtask;
