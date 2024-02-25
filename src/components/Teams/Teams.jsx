import React from "react";

const Teams = () => {
  return (
    <div className="bg-white px-4 py-10">
      <div className="flex items-center flex-col">
        <h2 className="text-2xl font-primary font-bold">Teams</h2>
        <span className="h-1 w-10 rounded-full bg-primaryLight"></span>
      </div>

      <div className="flex flex-col items-center mt-5 gap-10 py-3">
        <div className="flex flex-col items-center gap-3">
          <div className="service_icon border p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-primaryLight transition duration-500 hover:rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>

          <p className="font-bold text-lg font-primary">Team Member 1</p>
          <p className="font-medium text-sm text-center font-primary">
            Chief Execuive Officer (CEO)
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="service_icon border p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-primaryLight transition duration-500 hover:rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>

          <p className="font-bold text-lg font-primary">Team Member 2</p>
          <p className="font-medium text-sm text-center font-primary">
            Manager
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="service_icon border p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-primaryLight transition duration-500 hover:rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>

          <p className="font-bold text-lg font-primary">Team Member 3</p>
          <p className="font-medium text-sm text-center font-primary">
            Software Engineer
          </p>
        </div>
      </div>
    </div>
  );
};

export default Teams;
