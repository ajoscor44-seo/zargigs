import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import EarningWay from "../EarningWay/EarningWay";
import { useAuth } from "../../context/AuthContext";

const EarnWithAds = ({ setActiveTab }) => {
  const { currentUser, advertEarner } = useAuth();

  return (
    <div className="py-4">
      <p className="text-xs text-center font-semibold leading-4 px-4">
        Earn steady income by posting adverts of businesses and top brands on
        your social media page. To post adverts on Facebook, Instagram, Twitter
        or Tiktok, you MUST have atleast{" "}
        <span className="font-extrabold">1,000 Followers</span> on your social
        media account.
      </p>

      <p className="text-xs text-center mt-2 px-4 methodNote">
        Don't have up to 1,000 followers? Click{" "}
        <span
          onClick={() => setActiveTab("doTasks")}
          className="font-bold text-primary hover:underline"
        >
          here
        </span>{" "}
        to perform engagement tasks
      </p>

      <div className="py-4 flex flex-col gap-2 mb-6">
        {advertEarner.map((way) => {
          return (
            <Link
              to={currentUser.isMember ? way.pathToPage : "/become-a-member"}
              key={way.pathToPage}
            >
              <EarningWay
                way={way}
                type={"advert"}
                addSelectBtn={true}
                wayDescription={`Post adverts of various businesses and top brands on your
                      ${way.platformName} Page and earn N100 per advert post. The
                      more you post, the more you earn. Note that your
                      ${way.platformName} account must have atleast 1000 Active
                      Friends or Followers to be eligible for this task.`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EarnWithAds;
