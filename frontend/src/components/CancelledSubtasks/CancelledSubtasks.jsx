import React from "react";
import NoData from "../NoData/NoData";
import Subtask from "../Subtask/Subtask";

const CancelledSubtasks = ({ cancelledSubtasks }) => {
  return (
    <div className="font-primary">
      {cancelledSubtasks.length ? (
        <div className="tasks">
          {cancelledSubtasks.map((cancelledSubtask) => {
            return <Subtask task={cancelledSubtask} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-300 p-2 gap-2 h-96">
          <NoData
            textBelow={
              "You do not have any CANCELLED task here yet. Your CANCELLED tasks will appear on this page."
            }
          />
        </div>
      )}
    </div>
  );
};

export default CancelledSubtasks;
