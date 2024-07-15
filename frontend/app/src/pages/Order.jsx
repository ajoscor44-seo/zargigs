import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import PricingWay from "../components/PricingWay/PricingWay";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaHistory } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa6";
import numeral from "numeral";

const Order = () => {
  const [loading, setLoading] = useState(true);
  const { engagementCreator, getEngagementCreator, adminData } = useAuth();

  useEffect(() => {
    getEngagementCreator();
    return setLoading(false);
  }, []);

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
          Get people with atleast{" "}
          {numeral(adminData?.minimumFollowers).format("0,0")} active followers
          to repost your adverts and perform certain social tasks for you on
          their social media accounts. Select the type of task you want people
          to perform below:
        </p>
        <p className="bg-blue-200 text-center text-blue-500 text-xs mx-4 py-3 leading-4 font-semibold rounded mt-2">
          Click{" "}
          <Link
            to="/order-history"
            className="font-bold text-blue-500 hover:underline"
          >
            here
          </Link>{" "}
          to monitor and track all your orders and adverts.
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
            Engagement tasks are created to get people to perform simple tasks
            for you on their social media account. Check below to see the price
            of creating various engagement tasks:
          </p>
        </div>

        {loading ? (
          <div className="w-full min-h-96 flex justify-center items-center">
            <FaSpinner size={30} color="green" />
          </div>
        ) : (
          <div className="py-4 flex flex-col gap-2 mb-12">
            {engagementCreator.map((way) => {
              return (
                <Link to={way.pathToPage} key={way.pathToPage}>
                  <PricingWay
                    way={way}
                    key={way.pathToPage}
                    addSelectBtn={true}
                    wayDescription={`${way.description}`}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Order;
