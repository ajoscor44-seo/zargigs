import React from "react";
import { useAuth } from "../../context/LandingContext";

const NavBar = ({
  menuOpen,
  setMenuOpen,
  activeTab,
  setActiveTab,
  tabs,
  scrollTo,
}) => {
  const { adminData } = useAuth();
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;

  return (
    <div className="flex justify-between px-5 pb-5 lg:px-40 pt-5 items-center bg-white mb-5 shadow-sm lg:shadow-none fixed w-full">
      <div className="flex items-end gap-10 w-full">
        <div className="flex items-center gap-2">
          <img className="w-10 rounded" src={adminData?.appLogo} />
          <span className="text-3xl font-semibold font-primary uppercase">
            {adminData?.appName}.
          </span>
        </div>
        <nav className="hidden lg:block mb-1 absolute lg:relative lg:top-0 right-0 bg-white text-center lg:w-fit lg:border-none">
          <ul className="flex gap-5 flex-col lg:flex-row">
            {tabs.map((tab) => {
              return (
                <li
                  key={tab.name}
                  className={
                    activeTab == tab.name.toLowerCase()
                      ? "nav_text text-green-500 border-primary"
                      : "nav_text"
                  }
                  onClick={() => {
                    setActiveTab(tab.name.toLowerCase());
                    scrollTo(tab.toBig);
                    setMenuOpen(false);
                  }}
                >
                  {tab.name}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="gap-5 hidden lg:flex">
        <a href={`${app_url}/login`} target="_blank">
          <button className="btn border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white">
            Log In
          </button>
        </a>
        <a href={`${app_url}/signup`} target="_blank">
          <button className="btn bg-green-500 rounded-md text-white hover:bg-white hover:text-green-500">
            Create Account
          </button>
        </a>
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
            className="w-10 h-10 text-green-500"
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
