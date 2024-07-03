import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import { useAuth } from "../../context/LandingContext";

const OurHandles = () => {
  const { adminData } = useAuth();
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;

  return (
    <div className="bg-slate-50 px-4 py-10">
      <div className="flex items-center flex-col">
        <h2 className="text-xl font-bold text-center font-mono">
          Advertise and Earn With Your Social Media Account
        </h2>
        <p className="font-primary text-center text-md my-3">
          Join thousands of people using {adminData?.appName} to advertise and
          earn steady income with their social media accounts. Get started today
          for free.
        </p>
        <div className="flex justify-center gap-5 mt-3">
          <a href={`${app_url}/signup`} target="_blank">
            <button className="btn bg-primary text-white rounded-sm">
              CREATE ACCOUNT
            </button>
          </a>
          <a href={`${app_url}/login`} target="_blank">
            <button className="btn text-primary border border-primary rounded-sm">
              LOGIN
            </button>
          </a>
        </div>
      </div>
      <div className="flex items-center flex-col mt-5">
        <h2 className="text-lg font-primary font-bold text-center">
          Follow Us
        </h2>
        <span className="h-1 w-10 rounded-full bg-green-500"></span>
      </div>

      <div className="flex justify-center mt-4 gap-10 py-3">
        <a className="flex flex-col items-center">
          <div className="service_icon border p-4 rounded-full">
            <FaFacebook size={25} className="text-blue-600" />
          </div>

          <p className="font-bold text-lg font-primary">Facebook</p>
        </a>
        <a
          href="https://x.com/GigsflixTech/"
          target="_blank"
          className="flex flex-col items-center"
        >
          <div className="service_icon border p-4 rounded-full">
            <FaTwitter size={25} className="text-blue-400" />
          </div>

          <p className="font-bold text-lg font-primary">Twitter</p>
        </a>

        <a
          href="https://www.instagram.com/gigsflix_tech/"
          target="_blank"
          className="flex flex-col items-center"
        >
          <div className="service_icon border p-4 rounded-full">
            <FaSquareInstagram
              size={25}
              className="bg-instagram-gradient text-white rounded"
            />
          </div>

          <p className="font-bold text-lg font-primary">Instagram</p>
        </a>
      </div>
    </div>
  );
};

export default OurHandles;
