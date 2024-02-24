import React from "react";
import hero_img from "../../assets/images/girl-pointing.jpg";

const Hero = () => {
  return (
    <div className="hero flex flex-col justify-center items-center px-5">
      <div className="flex flex-col items-center text-center text-gray-700 text-3xl mt-10 pt-10 pb-5 font-extrabold">
        <span>Get Paid for Posting Adverts. Daily on Your Social Media</span>
      </div>
      <p className="text-center font-semibold font-primary">
        Earn daily income by reselling products, posting adverts and performing
        simple social tasks for top businesses and brands on your social media
        account.
      </p>
      <button className="btn bg-primaryLight text-white mt-5 font-bold">
        Get Started{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 inline-block"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
          />
        </svg>
      </button>
      <div className="mt-3 text-gray-600">
        Already a user?,{" "}
        <span className="text-primaryLight cursor-pointer">Login</span> now
      </div>
      <img className="hidden md:block" src={hero_img} />
    </div>
  );
};

export default Hero;
