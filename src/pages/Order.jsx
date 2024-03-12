import React from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import PricingWay from "../components/PricingWay/PricingWay";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaHistory } from "react-icons/fa";
import waysToCreateAdvertTasks from "../data/waysToCreateAdvertsTasks";
import user from "../data/user";

const Order = () => {
  return (
    <div className="font-primary">
      <BackNav
        pageName={"Order Engagements"}
        usePath={true}
        pathToGo={"/advertise"}
      />
      <div className="underBackNav">
        <Link to="/order-history">
          <div className="py-2 px-3 transition-colors duration-300 hover:bg-slate-100 rounded-full w-12 h-12 flex justify-center items-center text-primary fixed top-2 z-20 right-2">
            <FaHistory size={20} />
          </div>
        </Link>

        <p className="methodNote px-4 py-3 leading-4 font-semibold border">
          Get people with atleast 1000 active followers to repost your adverts
          and perform certain social tasks for you on their social media
          accounts. Select the type of task you want people to perform below:
        </p>
        <div className="py-3">
          <div className="flex justify-center gap-2">
            <Link to="/advertise">
              <div className="bg-transparent px-5 py-3 methodNote rounded-sm">
                ADVERT TASKS
              </div>
            </Link>
            <div className="bg-primary px-5 py-3 methodNote text-white rounded-sm">
              ENGAGEMENT TASKS
            </div>
          </div>
          <p className="text-center methodNote px-5 py-3 font-semibold">
            Advert tasks are created to get people to post your adverts on
            various social media platforms. Check below to see the price of
            creating various advert tasks:
          </p>
        </div>

        <div className="py-4 flex flex-col gap-2 mb-12">
          {waysToCreateAdvertTasks.map((way) => {
            return (
              <Link
                to={user.isMember ? way.pathToPage : "/earn/become-a-member"}
                key={way.pathToPage}
              >
                <PricingWay
                  way={way}
                  addSelectBtn={true}
                  wayDescription={`${way.description}`}
                />
              </Link>
            );
          })}
        </div>
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Order;
