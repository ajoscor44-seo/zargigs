import React from "react";
import Subtask from "../Subtask/Subtask";
import NoData from "../NoData/NoData";

const FailedSubtask = ({ failedSubtasks, slug, type }) => {
  return (
    <div className="font-primary">
      {failedSubtasks.length ? (
        <div className="tasks">
          {failedSubtasks.map((failedSubtask) => {
            return <Subtask task={failedSubtask} slug={slug} type={type} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-300 p-2 gap-2 h-96">
          <NoData
            textBelow={
              "You do not have any FAILED task here yet. Your FAILED tasks will appear on this page."
            }
          />
        </div>
      )}
    </div>
  );
};

export default FailedSubtask;
