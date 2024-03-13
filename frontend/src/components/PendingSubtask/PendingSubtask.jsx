import React from "react";
import Subtask from "../Subtask/Subtask";
import NoData from "../NoData/NoData";

const PendingSubtask = ({ pendingSubtasks }) => {
  return (
    <div className="font-primary">
      {pendingSubtasks.length ? (
        <div className="tasks">
          {pendingSubtasks.map((pendingSubtask) => {
            return <Subtask task={pendingSubtask} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-300 p-2 gap-2 h-96">
          <NoData
            textBelow={
              "You have to click on the button below so that your next Follow task will be generated for you. Only one task is generated per time. You have to do the generated task before another one can be generated for you."
            }
          />
          <button className="bg-primaryLight text-white p-2 rounded shadow-2xl font-semibold">
            Generate A New Task
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingSubtask;
