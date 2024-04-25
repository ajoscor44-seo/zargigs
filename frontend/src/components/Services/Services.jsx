import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaUsers, FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdAddReaction } from "react-icons/md";
import postAdvertImg from "../../assets/png/post-advert.png";
import lady_advertiser from "../../assets/images/lady-advertiser.jpg";

const Services = () => {
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;

  return (
    <div className="bg-white px-4 py-10 grid lg:grid-flow-col lg:flex-row lg:pt-20 lg:px-72 lg:justify-center lg:items-end">
      <div className="col-span-2">
        <img src={lady_advertiser} className="mb-10" />
      </div>
      <div>
        <div className="flex items-center flex-col col-span-1">
          <h2 className="text-3xl font-primary font-bold">For Advertisers</h2>
          <span className="h-1 w-10 rounded-full bg-primaryLight"></span>
        </div>

        <div className="flex flex-col items-center mt-5 gap-10 p-3">
          <div className="grid grid-flow-col gap-3 items-start">
            <div className="service_icon border p-4 rounded-full">
              <FaUsers size={30} className="text-orange-500" />
            </div>

            <div>
              <p className="font-bold text-lg font-primary">
                Gain More Followers.
              </p>
              <p className="font-medium text-sm font-primary mt-2 pr-2">
                Gain more followers on any of your social media handles at the
                lowest price.
              </p>
            </div>
          </div>
          <div className="grid grid-flow-col gap-3 items-start">
            <div className="service_icon border p-4 rounded-full">
              <MdAddReaction size={30} className="text-yellow-500" />
            </div>

            <div>
              <p className="font-bold text-lg font-primary">
                Targeted Engagement
              </p>
              <p className="font-medium text-sm font-primary mt-2 pr-2">
                Access our vast network of social media users ready to engage
                with your content. From likes and shares to posting your
                adverts, our members are here to help spread your message.
              </p>
            </div>
          </div>
          <div className="grid grid-flow-col gap-3 items-start">
            <div className="service_icon border p-4 rounded-full">
              <img
                className="w-8 h-8"
                src={postAdvertImg}
                alt="postAdvertImg"
              />
            </div>

            <div>
              <p className="font-bold text-lg font-primary">
                Authentic Promotion
              </p>
              <p className="font-medium text-sm font-primary mt-2 pr-2">
                Our platform promotes organic growth and engagement. By
                connecting with real users across various social media
                platforms, your brand gains authentic visibility and
                credibility.
              </p>
            </div>
          </div>
          <div className="grid grid-flow-col gap-3 items-start">
            <div className="service_icon border p-4 rounded-full">
              <FaMoneyBillTrendUp size={30} className="text-blue-500" />
            </div>

            <div>
              <p className="font-bold text-lg font-primary">
                Cost-Effective Campaigns
              </p>
              <p className="font-medium text-sm font-primary mt-2 pr-2">
                Enjoy flexible advertising solutions tailored to your budget.
                With GigsFlix, you pay only for genuine interactions, ensuring
                your investment brings maximum returns.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <a href={`${app_url}/signup`} target="_blank">
              <button className="btn bg-primaryLight rounded-sm text-white">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
