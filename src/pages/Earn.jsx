import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarnWithAds from "../components/EarnWithAds/EarnWithAds";
import EarnWithTasks from "../components/EarnWithTasks/EarnWithTasks";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import waysToEarnForTasks from "../data/waysToEarnForTasks";
import waysToEarnForAds from "../data/waysToEarnForAdvert";
import user from "../data/user";
import adminData from "../data/adminData";
import numeral from "numeral";

const Earn = () => {
  const [activeTab, setActiveTab] = useState("postAds");
  const totalAdvertTasks = waysToEarnForAds.reduce((total, way) => {
    return total + way.availableTasks.length;
  }, 0);
  const totalNormalTasks = waysToEarnForTasks.reduce((total, way) => {
    return total + way.availableTasks.length;
  }, 0);

  return (
    <div className="flex fullHeight">
      <BackNav pageName={"Perform Social Tasks And Earn"} />
      {user.isMember && user.uploadedTasks.length ? (
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
              You have {user.uploadedTasks.length} Uploaded{" "}
              {user.uploadedTasks.length > 1 ? "Tasks" : "Task"} that you have
              done but still IN REVIEW. Please be patient while your task is
              being reviewed. Click{" "}
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

            <div>
              {activeTab === "postAds" ? (
                <EarnWithAds setActiveTab={setActiveTab} />
              ) : (
                <EarnWithTasks setActiveTab={setActiveTab} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="underBackNav flex flex-col flex-1 font-primary bg-white mt-3 highBase">
          <span className="text-center text-xs mb-1">
            Become a Member Today
          </span>
          <h2 className="font-bold text-2xl px-2 text-center">
            Turn Your Social Media Accounts into a Money Making Machine!
          </h2>
          <p className="text-xs leading-5 font-semibold py-2 px-4">
            Do you know you can earn daily income by performing social media
            tasks such as likes, follows, comments, shares, retweets etc. That
            is one of the many benefits of becoming a member on Gigsflix.
          </p>
          <div>
            <h3 className="text-xs mb-5 mt-3 px-4 leading-5">
              When you activate your account with a one-time membership fee of ₦
              {numeral(adminData.membershipFee).format("0,0")}, you get lifetime
              access to enjoy the following benefits:
            </h3>
            <ul className="list-disc pl-12 pr-4">
              <li className="text-xs font-semibold leading-5 mb-5">
                <span className="font-extrabold">
                  Earn steady daily figures
                </span>{" "}
                by following, liking, commenting, sharing, retweeting or posting
                adverts for businesses on your social media. Click{" "}
                <span className="text-primaryLight hover:underline">here</span>{" "}
                to see what you will earn when you perform social tasks
              </li>
              <li className="text-xs font-semibold leading-5 mb-5">
                <span className="font-extrabold">
                  Earn an Instant Referral Commission of ₦500
                </span>{" "}
                when you refer someone to become a member on Hawkit. The more
                you refer, the more you earn. Click{" "}
                <span className="text-primaryLight hover:underline">here</span>{" "}
                to learn how referral works.
              </li>
              <li className="text-xs font-semibold leading-5 mb-5">
                <span className="font-extrabold">
                  Earn Social Boost Referral Commission of 20% of any amount
                  paid
                </span>{" "}
                when you refer someone to Buy Likes, Followers, Comments,
                Shares, Whatsapp Post Views etc. Click{" "}
                <span className="text-primaryLight hover:underline">here</span>{" "}
                to learn how referral works.
              </li>
            </ul>
            <h3 className="text-xs px-4 mb-4">
              ...and so much more benefits for you!
            </h3>

            <p className="px-4 text-xs">
              What are you waiting for? Click the button below to make payments
              and activate your membership.
            </p>
          </div>
          <div className="bg-white flex justify-between items-center fixed bottom-16 pt-0 pb-1 w-full px-5 border">
            <p>
              <span className="methodNote">Membership Fee</span>
              <h2 className="font-semibold text-2xl">
                ₦{numeral(adminData.membershipFee).format("0,0")}
              </h2>
            </p>

            <button className="uppercase text-xs bg-primaryLight py-2 px-4 rounded-sm text-white font-semibold">
              Click Here To Pay Now
            </button>
          </div>
        </div>
      )}

      <ClientMenuBar />
    </div>
  );
};

export default Earn;
