import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { FaSpinner } from "react-icons/fa6";
import NoData from "../components/NoData/NoData";
import axios from "axios";
import { RiErrorWarningFill } from "react-icons/ri";
import Task from "../components/Task/Task";

const TaskHistory = () => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tabs = ["pending", "in-review", "failed", "completed", "cancelled"];
  const [activeTab, setActiveTab] = useState("in-review");

  const fetchtaskHistory = async () => {
    try {
      const response = await axios.get(
        `/api/v1/tasks/history?status=${activeTab}`
      );
      const data = response.data;

      setTaskHistory(data);
      return setLoading(false);
    } catch (error) {
      setLoading(false);
      return setError(error.response.data.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTaskHistory([]);
    fetchtaskHistory();
  }, [activeTab]);

  return (
    <div>
      <BackNav usePath={true} pathToGo={"/earn"} pageName={"Task History"} />
      <div className="underBackNav">
        <div className="flex w-full justify-between bg-blue-50">
          {tabs.map((tab) => {
            return (
              <div
                key={tab.toLowerCase()}
                className={
                  activeTab == tab.toLowerCase()
                    ? "subTaskHistoryTab gap-1 active capitalize"
                    : "subTaskHistoryTab gap-1 capitalize"
                }
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </div>
            );
          })}
        </div>
        {loading ? (
          <div className="min-h-96 flex justify-center items-center">
            <FaSpinner className="text-green-500" size={30} />
          </div>
        ) : !taskHistory.length ? (
          <div className="min-h-96 flex justify-center items-center">
            <NoData textBelow={"No task history"} />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center px-5 flex flex-col justify-center items-center min-h-96">
            <RiErrorWarningFill size={60} />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <div>
            {taskHistory.map((task) => {
              return <Task task={task} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
