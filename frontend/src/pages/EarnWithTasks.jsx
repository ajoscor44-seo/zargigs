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
import numeral from "numeral";

const EarnWithTasks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tabs = ["pending", "in-review", "failed", "completed", "cancelled"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
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
    try {
      const response = await axios.get(
        `/api/v1/tasks/generate?type=engagement&platform=${wayToEarn.platformName.toLowerCase()}`
      );

      setGeneratedTask(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const getAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/tasks?status=${activeTab.toLowerCase()}&platform=${wayToEarn.platformName.toLowerCase()}`
      );
      setTaskList(response.data);
      setGeneratedTask(null);
      setError(null);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }

    return setLoading(false);
  };

  const cancelGeneratedTask = async (status) => {
    if (status.toLowerCase() !== "pending") return;
    setLoading(true);
    try {
      const response = await axios.delete(
        `/api/v1/tasks/cancel-task?type=engagement&platform=${wayToEarn.platformName.toLowerCase()}`
      );

      if (response.data.failed) {
        return setError(response.data.message);
      }

      setGeneratedTask(null);
      setTaskList(null);
      return setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
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
            {tabs.map((tab) => {
              return (
                <div
                  className={
                    activeTab == tab.toLowerCase()
                      ? "subTaskHistoryTab gap-1 active capitalize"
                      : "subTaskHistoryTab gap-1 capitalize"
                  }
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}{" "}
                  {taskList ? (
                    <span className="bg-red-500 text-white px-1 rounded">
                      {taskList && tab.toLowerCase() == "pending"
                        ? 1
                        : Array.isArray(taskList) &&
                          tab.toLowerCase() !== "pending"
                        ? numeral(taskList.length).format("0,0")
                        : null}
                    </span>
                  ) : (
                    <span></span>
                  )}
                </div>
              );
            })}
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
                  generatedTask={generatedTask || taskList}
                  cancelGeneratedTask={cancelGeneratedTask}
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
              <p className="text-lg font-semibold">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarnWithTasks;
