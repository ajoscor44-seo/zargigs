import React from "react";
import { BiSolidCheckCircle } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa6";
import CountdownTimer from "../CountDownTimer/CountDownTimer";
import formatDate from "../../hooks/formatDate";
import { Link } from "react-router-dom/cjs/react-router-dom";
import ItemIcon from "../ItemIcon/ItemIcon";

const PendingTaskSubtask = ({
  task,
  cancelTask,
  slug,
  platform,
  type,
  status,
  hideBtn,
}) => {
  return (
    <div className="border-b font-primary">
      <div className="flex items-center px-2 py-1 gap-2 font-primary">
        <ItemIcon
          platform={task?.taskPlatform}
          size={45}
          playstoreSize={"w-20 h-20"}
        />
        <div className="flex-1 flex justify-between items-center">
          <div className="flex flex-col py-1">
            <span className="methodNote text-gray-400 font-semibold">
              {formatDate(task?.createdAt)}
            </span>
            <h2 className="text-xs font-bold">{task?.title}</h2>
            <span className="methodNote font-semibold">
              Earning:{" "}
              <span className="font-extrabold">
                ₦{task?.earningPerTask} per {task?.taskType}
              </span>
            </span>
          </div>
          <div>
            {hideBtn ? (
              <FaSpinner className="text-orange-500 my-1 mx-2" />
            ) : (
              <Link
                to={`/earn/${type}/${slug}/${platform}/${status}/${task?.id}`}
              >
                <button
                  className={
                    "capitalize p-1 text-sm rounded text-green-500 flex items-center border"
                  }
                >
                  <BiSolidCheckCircle size={20} />
                  <span className="font-semibold">Do now</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 px-2">
        <span className="mt-1 text-gray-500 font-semibold text-sm">
          This task will expire in:
        </span>
        <CountdownTimer totalSeconds={Math.round(task?.timeLeftS)} />
      </div>
      <div className="flex flex-col gap-2 p-2 items-center bg-gray-200 mx-5 rounded-sm border">
        <p className="text-xs text-gray-600 text-center">
          Don't want to perform this task? You can cancel this task so that
          another one can be generated for you. There is NO penalty for
          cancelling a task.
        </p>
        <button
          onClick={() => cancelTask("pending")}
          className="text-white text-sm font-semibold bg-red-600 rounded-sm py-2 my-2 w-40"
        >
          CANCEL THIS TASK
        </button>
      </div>
      {hideBtn ? (
        <div></div>
      ) : (
        <div className="flex flex-col bg-slate-100 gap-2 p-3 items-center">
          <p className="text-xs text-gray-600 text-center font-semibold">
            You can only generate a task at a time. You have to do pending task
            before it expires so that another one can be generated for you.
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingTaskSubtask;
