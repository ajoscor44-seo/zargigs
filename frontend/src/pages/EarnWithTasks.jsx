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
  const tabs = ["pending", "in-review", "failed", "completed", "cancelled"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [generatedTask, setGeneratedTask] = useState(undefined);
  const [taskList, setTaskList] = useState(undefined);
  const [statusTotals, setStatusTotal] = useState({});
  // Gets route parameter
  const { slug } = useParams();

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
        `/api/v1/tasks?type=engagement&status=${activeTab.toLowerCase()}&platform=${wayToEarn.platformName.toLowerCase()}`
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

  // Cancels generated task
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

  const getTasksTotalsBasedOnStatus = async () => {
    setLoading(true);
    const response = await axios.get(
      `/api/v1/tasks/user-total?type=engagement&platform=${wayToEarn.platformName.toLowerCase()}`
    );

    if (response.data?.failed) {
      return setError(response.data.message);
    }
    setStatusTotal(response.data);
    return setLoading(false);
  };

  useEffect(() => {
    const fetchDatas = async () => {
      await getAllTasks();
      await getTasksTotalsBasedOnStatus();
    };

    fetchDatas();
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
                  {statusTotals[tab.toString()] ? (
                    <span className="bg-red-500 text-white px-1 rounded">
                      {statusTotals[tab.toString()]}
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
                  generateNewTask={generateNewTask}
                  tasks={generatedTask || taskList}
                  cancelGeneratedTask={cancelGeneratedTask}
                  slug={slug}
                  platform={wayToEarn.platformName.toLowerCase()}
                  status={activeTab}
                />
              ) : activeTab == "in-review" ? (
                <InReviewSubtask
                  inReviewSubtasks={taskList}
                  slug={slug}
                  platform={wayToEarn.platformName.toLowerCase()}
                  status={activeTab}
                />
              ) : activeTab == "failed" ? (
                <FailedSubtask
                  failedSubtasks={taskList}
                  slug={slug}
                  platform={wayToEarn.platformName.toLowerCase()}
                  status={activeTab}
                />
              ) : activeTab == "completed" ? (
                <CompletedSubtask
                  completedSubtasks={taskList}
                  slug={slug}
                  platform={wayToEarn.platformName.toLowerCase()}
                  status={activeTab}
                />
              ) : (
                <CancelledSubtasks
                  cancelledSubtasks={taskList}
                  slug={slug}
                  platform={wayToEarn.platformName.toLowerCase()}
                  status={activeTab}
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
