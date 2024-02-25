import React, { useState } from "react";
import hero_img from "../../assets/images/girl-pointing.jpg";
import NavBar from "../NavBar/NavBar";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const tabs = ["Home", "For Advertisers", "For Members", "About", "Contacts"];

  return (
    <div className="relative">
      <div className="bg-primary relative h-fit">
        <NavBar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />
        {menuOpen && (
          <nav className="block lg:hidden pb-5 fixed right-0 bg-white text-center w-full shadow-lg top-20 border-t border-primaryLight">
            <ul className="flex lg:gap-5 flex-col lg:flex-row">
              {tabs.map((tab) => {
                return (
                  <li
                    className={
                      activeTab == tab.toLowerCase()
                        ? "nav_text text-primaryLight border-primary"
                        : "nav_text"
                    }
                    onClick={() => {
                      setActiveTab(tab.toLowerCase());
                      setMenuOpen(false);
                    }}
                  >
                    {tab}
                  </li>
                );
              })}
            </ul>
            <div className="gap-3 lg:hidden flex justify-center px-3 mt-2">
              <button className="btn border border-primaryLight text-primaryLight rounded-md hover:bg-primaryLight hover:text-white">
                Log In
              </button>
              <button className="btn bg-primaryLight rounded-md text-white hover:bg-white hover:text-primaryLight">
                Create Account
              </button>
            </div>
          </nav>
        )}
      </div>
      <div className="flex flex-col lg:flex-row border">
        <div className="flex flex-col justify-center items-center px-5 py-20 lg:pt-40">
          <div className="flex flex-col items-center text-center text-gray-700 text-3xl mt-10 pt-10 pb-5 font-extrabold">
            <span className="text-primaryLight mb-5 md:text-4xl px-4">
              Ready To Increase Your Income?
            </span>
            <span className="font-sans px-5 py-3">
              Get Paid for Posting Adverts Daily On Your Social Media.
            </span>
          </div>
          <p className="text-center font-semibold font-primary text-lg">
            Earn daily income by reselling products, posting adverts and
            performing simple social tasks for top businesses and brands on your
            social media account.
          </p>

          <button className="btn bg-primaryLight text-white mt-5 font-bold rounded-full">
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
          <div className="mt-5 text-gray-600 font-medium">
            Already A User?,{" "}
            <span className="text-primaryLight cursor-pointer hover:underline font-primary font-bold">
              {" "}
              Login{" "}
            </span>
          </div>
          <img className="hidden lg:block" src={hero_img} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
