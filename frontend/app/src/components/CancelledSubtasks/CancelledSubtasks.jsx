import React from "react";
import NoData from "../NoData/NoData";
import Subtask from "../Subtask/Subtask";

const CancelledSubtasks = ({
  cancelledSubtasks,
  slug,
  platform,
  status,
  type,
}) => {
  return (
    <div className="font-primary">
      {cancelledSubtasks?.length ? (
        <div className="tasks">
          {cancelledSubtasks.map((cancelledSubtask, i) => {
            return (
              <Subtask
                key={i}
                task={cancelledSubtask}
                slug={slug}
                platform={platform}
                status={status}
                type={type}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <NoData
            textBelow={
              "You do not have any cancelled tasks."
            }
          />
        </div>
      )}
    </div>
  );
};

export default CancelledSubtasks;
