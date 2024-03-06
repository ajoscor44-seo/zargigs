import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarnWithAds from "../components/EarnWithAds/EarnWithAds";
import EarnWithTasks from "../components/EarnWithTasks/EarnWithTasks";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const Earn = () => {
  const [activeTab, setActiveTab] = useState("postAds");
  const uploadedTasks = ["Hello", "Hello"];
  const availableTasks = ["This", "That"];

  return (
    <div>
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
            You have {uploadedTasks.length} Uploaded{" "}
            {uploadedTasks.length > 1 ? "Tasks" : "Task"} that you have done but
            still IN REVIEW. Please be patient while your task is being
            reviewed. Click{" "}
            <Link
              to="/tasks-history"
              className="font-bold text-blue-700 hover:underline"
            >
              here
            </Link>{" "}
            to monitor and track the progress of your tasks in review.
          </p>
        </div>

        <div className="font-primary py-4">
          <div className="flex items-center gap-2 text-xs border-b mx-4">
            <div
              className={
                activeTab === "postAds"
                  ? "bg-slate-200 rounded-t p-3 font-bold text-center"
                  : "rounded-t p-3 font-bold text-center"
              }
              onClick={() => setActiveTab("postAds")}
            >
              POST ADVERTS
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
              <span className="bg-red-500 text-white px-2 rounded">
                {availableTasks.length}
              </span>
            </div>
          </div>

          <div>
            {activeTab === "postAds" ? (
              <EarnWithAds setActiveTab={setActiveTab} />
            ) : (
              <EarnWithTasks />
            )}
          </div>
        </div>
      </div>

      <ClientMenuBar />
    </div>
  );
};

export default Earn;
