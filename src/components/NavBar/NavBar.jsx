import React, { useState } from "react";
import logo from "../../assets/png/logo-color.png";

const NavBar = ({ menuOpen, setMenuOpen, activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex justify-between px-5 pb-5 lg:px-40 pt-5 items-center bg-white mb-5 shadow-sm lg:shadow-none fixed w-full">
      <div className="flex items-end gap-10 w-full">
        <div className="flex items-center gap-2">
          <img className="w-10 rounded" src={logo} />
          <span className="text-3xl font-semibold font-primary">GIGSFLIX.</span>
        </div>
        <nav className="hidden lg:block mb-1 absolute lg:relative lg:top-0 right-0 bg-white text-center lg:w-fit lg:border-none">
          <ul className="flex gap-5 flex-col lg:flex-row">
            {tabs.map((tab) => {
              return (
                <li
                  className={
                    activeTab == tab.toLowerCase()
                      ? "nav_text text-primaryLight border-primary"
                      : "nav_text"
                  }
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="gap-5 hidden lg:flex">
        <button className="btn border border-primaryLight text-primaryLight rounded-md hover:bg-primaryLight hover:text-white">
          Log In
        </button>
        <button className="btn bg-primaryLight rounded-md text-white hover:bg-white hover:text-primaryLight">
          Create Account
        </button>
      </div>
      <div className="block lg:hidden">
        {!menuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-primaryLight"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default NavBar;
