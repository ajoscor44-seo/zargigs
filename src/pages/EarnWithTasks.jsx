import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import waysToEarnForTasks from "../data/waysToEarnForTasks";
import EarningWay from "../components/EarningWay/EarningWay";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import InReviewSubtask from "../components/InReviewSubtask/InReviewSubtask";
import PendingSubtask from "../components/PendingSubtask/PendingSubtask";
import FailedSubtask from "../components/FailedSubtask/FailedSubtask";
import CompletedSubtask from "../components/CompletedSubtask/CompletedSubtask";
import CancelledSubtasks from "../components/CancelledSubtasks/CancelledSubtasks";

const EarnWithTasks = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const param = useParams();
  const slug = param.slug;

  const wayToEarn = waysToEarnForTasks.find(
    (way) => way.pathToPage === "/earn/" + slug
  );

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
                activeTab == "inReview"
                  ? "subTaskHistoryTab gap-1 active"
                  : "subTaskHistoryTab gap-1"
              }
              onClick={() => setActiveTab("inReview")}
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

          <div className="subTasksHistory">
            {activeTab == "pending" ? (
              <PendingSubtask
                pendingSubtasks={wayToEarn.subTasksHistory.pendingTasks}
              />
            ) : activeTab == "inReview" ? (
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
        </div>
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default EarnWithTasks;
