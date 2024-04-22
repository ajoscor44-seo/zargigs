import React, { useState } from "react";
import NoData from "../NoData/NoData";
import Modal from "../Modal/Modal";
import PendingTaskSubtask from "../PendingtaskSubtask/PendingTaskSubtask";
import { FaSpinner } from "react-icons/fa6";

const PendingSubtask = ({ generatedTask, generateNewTask }) => {
  const [isOpen, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setModalState(!isOpen);
  };

  const generateTask = async () => {
    toggleModal();
    setLoading(true);
    await generateNewTask();
    return setLoading(false);
  };

  return (
    <div className="font-primary">
      {generatedTask?.id ? (
        <div className="tasks">
          <PendingTaskSubtask task={generatedTask} />;
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-300 p-2 gap-2 h-96">
          <NoData
            textBelow={
              "You have to click on the button below so that your next Follow task will be generated for you. Only one task is generated per time. You have to do the generated task before another one can be generated for you."
            }
          />
          {isOpen && (
            <Modal
              title={"Generate New Engagement Task?"}
              content={
                "Are you sure you want to generate your next engagement task now. You have 1 hour to perform this task. Please confirm only if you are ready to perform the task."
              }
              posBtnText={"Yes"}
              negBtnText={"No"}
              onNegClick={toggleModal}
              onPosClick={generateTask}
            />
          )}
          <button
            onClick={toggleModal}
            className="bg-primaryLight text-white p-2 rounded shadow-2xl font-semibold"
          >
            {loading ? <FaSpinner size={25} /> : "Generate A New Task"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingSubtask;
