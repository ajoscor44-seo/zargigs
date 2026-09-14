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
          {inReviewSubtasks.map((inReviewSubtask, i) => {
            return (
              <Subtask
                key={i}
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
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <NoData
            textBelow={
              "You do not have any tasks in review yet. Once you submit proof for a task, it will appear here."
            }
          />
        </div>
      )}
    </div>
  );
};

export default InReviewSubtask;
