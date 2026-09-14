import React from "react";
import Subtask from "../Subtask/Subtask";
import NoData from "../NoData/NoData";

const FailedSubtask = ({ failedSubtasks, slug, type, status, platform }) => {
  return (
    <div className="font-primary">
      {failedSubtasks?.length ? (
        <div className="tasks">
          {failedSubtasks.map((failedSubtask, i) => {
            return (
              <Subtask
                key={i}
                task={failedSubtask}
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
              "You do not have any failed or disapproved tasks."
            }
          />
        </div>
      )}
    </div>
  );
};

export default FailedSubtask;
