import React from "react";
import waysToEarnForTasks from "../../data/waysToEarnForTasks";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarningWay from "../EarningWay/EarningWay";
import { useAuth } from "../../context/AuthContext";

const EarnWithTasks = ({ setActiveTab }) => {
  const { currentUser } = useAuth();

  return (
    <div className="py-4">
      <p className="text-xs text-center font-semibold leading-4 px-4">
        Earn steady income by performing simple social and engagement tasks for
        businesses on your social media account.
      </p>

      <p className="text-xs text-center mt-2 px-4 methodNote">
        Do you have up to 1,000 followers? Click{" "}
        <span
          onClick={() => setActiveTab("postAds")}
          className="font-bold text-primary hover:underline"
        >
          here
        </span>{" "}
        to earn from posting adverts on your social media account.
      </p>

      <div className="py-4 flex flex-col gap-2 mb-6">
        {waysToEarnForTasks.map((way) => {
          return (
            <Link
              to={currentUser.isMember ? way.pathToPage : "/become-a-member"}
              key={way.pathToPage}
            >
              <EarningWay
                way={way}
                addSelectBtn={true}
                wayDescription={`${way.title}. The more ${way.whatTheyDo}, the more you earn.`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EarnWithTasks;
