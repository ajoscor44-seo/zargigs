import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import waysToEarnForTasks from "../data/waysToEarnForTasks";
import EarningWay from "../components/EarningWay/EarningWay";
import InReviewSubtask from "../components/InReviewSubtask/InReviewSubtask";
import PendingSubtask from "../components/PendingSubtask/PendingSubtask";
import FailedSubtask from "../components/FailedSubtask/FailedSubtask";
import CompletedSubtask from "../components/CompletedSubtask/CompletedSubtask";
import CancelledSubtasks from "../components/CancelledSubtasks/CancelledSubtasks";
import waysToEarnForAds from "../data/waysToEarnForAdvert";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
import NoData from "../components/NoData/NoData";
import { RiErrorWarningFill } from "react-icons/ri";

const EarnWithTasks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [generatedTask, setGeneratedTask] = useState(undefined);
  const [taskList, setTaskList] = useState(undefined);

  const param = useParams();
  const slug = param.slug;

  const waysToEarn = slug.startsWith("earn")
    ? waysToEarnForTasks
    : waysToEarnForAds;

  const wayToEarn = waysToEarn.find(
    (way) => way.pathToPage === "/earn/" + slug
  );

  // Generates the task

  const generateNewTask = async () => {
    const response = await axios.get(
      `/api/v1/tasks/generate?type=engagement&platform=${wayToEarn.platformName.toLowerCase()}`
    );

    setGeneratedTask(response.data);
  };

  const getAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/tasks?status=${activeTab.toLowerCase()}`
      );
      setTaskList(response.data);
      setError(null);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }

    return setLoading(false);
  };

  useEffect(() => {
    getAllTasks();
  }, [activeTab]);
  return (
    <div>
      <BackNav pageName={wayToEarn.title} usePath={true} pathToGo={"/earn"} />
      <div className="underBackNav font-primary">
        <EarningWay way={wayToEarn} />
        <div className="subTaskHistory">
          <div className="flex w-full justify-between bg-blue-50">
            <div
              className={
                activeTab == "pending"
                  ? "subTaskHistoryTab gap-1 active"
                  : "subTaskHistoryTab gap-1"
              }
              onClick={() => setActiveTab("pending")}
            >
              Pending{" "}
              {wayToEarn.subTasksHistory.pendingTasks.length ? (
                <span className="bg-red-500 text-white px-1 rounded">
                  {wayToEarn.subTasksHistory.pendingTasks.length}
                </span>
              ) : (
                <span></span>
              )}
            </div>
            <div
              className={
                activeTab == "in-review"
                  ? "subTaskHistoryTab gap-1 active"
                  : "subTaskHistoryTab gap-1"
              }
              onClick={() => setActiveTab("in-review")}
            >
              In Review{" "}
              {wayToEarn.subTasksHistory.inReviewTasks.length ? (
                <span className="bg-red-500 text-white px-1 rounded">
                  {" "}
                  {wayToEarn.subTasksHistory.inReviewTasks.length}
                </span>
              ) : (
                <span></span>
              )}
            </div>
            <div
              className={
                activeTab == "failed"
                  ? "subTaskHistoryTab gap-1 active"
                  : "subTaskHistoryTab gap-1"
              }
              onClick={() => setActiveTab("failed")}
            >
              Failed{" "}
              {wayToEarn.subTasksHistory.failedTasks.length ? (
                <span className="bg-red-500 text-white px-1 rounded">
                  {wayToEarn.subTasksHistory.failedTasks.length}
                </span>
              ) : (
                <span></span>
              )}
            </div>
            <div
              className={
                activeTab == "completed"
                  ? "subTaskHistoryTab gap-1 active"
                  : "subTaskHistoryTab gap-1"
              }
              onClick={() => setActiveTab("completed")}
            >
              Completed{" "}
              {wayToEarn.subTasksHistory.completedTasks.length ? (
                <span className="bg-red-500 text-white px-1 rounded">
                  {wayToEarn.subTasksHistory.completedTasks.length}
                </span>
              ) : (
                <span></span>
              )}
            </div>
            <div
              className={
                activeTab == "cancelled"
                  ? "subTaskHistoryTab gap-1 active"
                  : "subTaskHistoryTab gap-1"
              }
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled{" "}
              {wayToEarn.subTasksHistory.cancelledTasks.length ? (
                <span className="bg-red-500 text-white px-1 rounded">
                  {wayToEarn.subTasksHistory.cancelledTasks.length}
                </span>
              ) : (
                <span></span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-60">
              <FaSpinner className="text-green-500" size={25} />
            </div>
          ) : error?.toLowerCase() == "no data available." ? (
            <div className="flex justify-center items-center min-h-96">
              <NoData textBelow={error} />
            </div>
          ) : !error ? (
            <div>
              {activeTab == "pending" ? (
                <PendingSubtask
                  pendingSubtasks={wayToEarn.subTasksHistory.pendingTasks}
                  generateNewTask={generateNewTask}
                  generatedTask={taskList || generatedTask}
                />
              ) : activeTab == "in-review" ? (
                <InReviewSubtask
                  inReviewSubtasks={wayToEarn.subTasksHistory.inReviewTasks}
                />
              ) : activeTab == "failed" ? (
                <FailedSubtask
                  failedSubtasks={wayToEarn.subTasksHistory.failedTasks}
                />
              ) : activeTab == "completed" ? (
                <CompletedSubtask
                  completedSubtasks={wayToEarn.subTasksHistory.completedTasks}
                />
              ) : (
                <CancelledSubtasks
                  cancelledSubtasks={wayToEarn.subTasksHistory.cancelledTasks}
                />
              )}
            </div>
          ) : (
            <div className="text-red-500 flex flex-col justify-center items-center min-h-96">
              <RiErrorWarningFill size={60} />
              <p className="text-lg font-semibold">Something went wrong.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarnWithTasks;
