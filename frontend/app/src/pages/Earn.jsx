import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarnWithAds from "../components/EarnWithAds/EarnWithAds";
import EarnWithTasks from "../components/EarnWithTasks/EarnWithTasks";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa6";

const Earn = () => {
  const { getEngagementEarners, getAdvertEarners } = useAuth();
  const [activeTab, setActiveTab] = useState("postAds");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusTotal, setStatusTotal] = useState({});
  const [totalAdvertTasks, setTotalAdvertTasks] = useState(0);
  const [totalNormalTasks, setTotalNormalTasks] = useState(0);

  const getTasksTotalsBasedOnStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/tasks/user-total");

      setStatusTotal(response.data);
      return setLoading(false);
    } catch (error) {
      console.log();
      return setError("Oops, an error occurred");
    }
  };

  const getTotalEngagementTasks = async () => {
    const data = await axios
      .get("/api/v1/tasks/engagements?page=1&limit=0")
      .then((response) => response.data)
      .catch((error) => console.error(error));
    return setTotalNormalTasks(data.total);
  };

  const getTotalAdvertTasks = async () => {
    const data = await axios
      .get("/api/v1/tasks/adverts?page=1&limit=0")
      .then((response) => response.data)
      .catch((error) => console.error(error));
    return setTotalAdvertTasks(data.total);
  };

  useEffect(() => {
    getTasksTotalsBasedOnStatus();
    getTotalEngagementTasks();
    getTotalAdvertTasks();
    getEngagementEarners();
    getAdvertEarners();
  }, []);

  return (
    <div className="flex fullHeight">
      <BackNav pageName={"Perform Social Tasks And Earn"} />
      <div className="underBackNav font-primary">
        <Link to="/tasks-history">
          <div className="py-2 px-3 transition-colors duration-300 hover:bg-slate-100 rounded-full w-12 h-12 flex justify-center items-center text-primary fixed top-2 z-20 right-2">
            <FaHistory size={20} />
          </div>
        </Link>

        <p className="text-xs py-3 px-4">
          You can earn constant daily income by posting adverts of various
          businesses and top brands on your social media accounts. To get
          started, simply click on any of the earning options shown below:
        </p>
        <div className="bg-blue-200 p-3 rounded mx-4">
          <p className="text-blue-500 text-xs">
            You have {statusTotal["in-review"] ? statusTotal["in-review"] : 0}{" "}
            Uploaded {statusTotal["in-review"] > 1 ? "Tasks" : "Task"} that you
            have done but still IN REVIEW. Please be patient while your task is
            being reviewed. Click{" "}
            <Link
              to="/tasks-history"
              className="font-bold text-blue-700 hover:underline"
            >
              here
            </Link>{" "}
            to monitor and track the progress of your tasks in review.
          </p>
          <h2 className="text-orange-500 text-xs text-center font-semi old hover:underline">
            <a
              href="https://whatsapp.com/channel/0029Vaiyg0FFcovzni47lR34"
              target="_blank"
            >
              Click here to join our channel for the latest update on gigsflix
            </a>
          </h2>
        </div>

        <div className="font-primary py-4">
          <div className="flex items-center gap-2 text-xs border-b mx-4">
            <div
              className={
                activeTab === "postAds"
                  ? "bg-slate-200 rounded-t p-3 font-bold text-center flex items-center justify-between"
                  : "rounded-t p-3 font-bold text-center flex items-center justify-between"
              }
              onClick={() => setActiveTab("postAds")}
            >
              POST ADVERTS{" "}
              {totalAdvertTasks ? (
                <span className="bg-red-500 text-white px-2 rounded">
                  {totalAdvertTasks}
                </span>
              ) : (
                <span></span>
              )}
            </div>
            <div
              className={
                activeTab === "doTasks"
                  ? "bg-slate-200 rounded-t p-3 font-bold text-center flex-1 flex items-center justify-between"
                  : "rounded-t p-3 font-bold text-center flex-1 flex items-center justify-between"
              }
              onClick={() => setActiveTab("doTasks")}
            >
              PERFORM SOCIAL TASKS{" "}
              {totalNormalTasks ? (
                <span className="bg-red-500 text-white px-2 rounded">
                  {totalNormalTasks}
                </span>
              ) : (
                <span></span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="min-h-96 flex justify-center items-center">
              <FaSpinner size={25} color="green" />
            </div>
          ) : (
            <div>
              {activeTab === "postAds" ? (
                <EarnWithAds setActiveTab={setActiveTab} />
              ) : (
                <EarnWithTasks setActiveTab={setActiveTab} />
              )}
            </div>
          )}
        </div>
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Earn;
