import React, { useState } from "react";
import logo from "../../assets/png/logo-color.png";

const NavBar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = ["Home", "About", "Services", "Team", "Contacts", "Blogs"];

  return (
    <div className="flex justify-between px-5 pb-2 md:px-0 md:mx-40 pt-5 items-center bg-white mb-5 shadow-sm md:shadow-none">
      <div className="flex items-end gap-10 w-full">
        <div className="flex items-center gap-2">
          <img className="w-10 rounded" src={logo} />
          <span className="text-3xl font-semibold font-primary">GIGSFLIX.</span>
        </div>
        <nav className="hidden md:block mb-1 absolute md:relative top-12 md:top-0 right-0 bg-white text-center w-full md:w-fit border md:border-none">
          <ul className="flex gap-5 flex-col md:flex-row">
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
        {menuOpen && (
          <nav className="block md:hidden mb-1 absolute bottom-0 md:top-0 right-0 bg-white text-center w-full md:w-fit border md:border-none">
            <ul className="flex gap-5 flex-col md:flex-row">
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
        )}
      </div>

      <div className="gap-5 hidden md:flex">
        <button className="btn text-primaryLight">Log In</button>
        <button className="btn bg-primaryLight text-white">
          Create Account
        </button>
      </div>
      <div className="block md:hidden">
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
