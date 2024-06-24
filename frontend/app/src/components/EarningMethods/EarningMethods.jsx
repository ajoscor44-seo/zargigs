import React from "react";
import postAdvertImg from "../../assets/png/post-advert.png";
import { GiTakeMyMoney } from "react-icons/gi";
import { Link } from "react-router-dom/cjs/react-router-dom";

const EarningMethods = () => {
  return (
    <div className="p-4 grid grid-cols-2 gap-3">
      <div className="earningMethod">
        <div className="flex gap-2">
          <div className="methodInfo">
            <GiTakeMyMoney size={35} className="text-primary" />
          </div>
          <div className="methodNote">
            Earn daily by posting adverts and performing tasks on your social
            media accounts.
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Link to="/earn" className="startTask shadow-2xl">
            Get Started
          </Link>
        </div>
      </div>

      <div className="earningMethod">
        <div className="flex gap-2">
          <div className="methodInfo">
            <img className="w-100" src={postAdvertImg} />
          </div>
          <div className="methodNote">
            Get people to repost your adverts and perform social tasks for you
            on their social media account.
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Link to="/advertise" className="startTask shadow-2xl">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EarningMethods;
