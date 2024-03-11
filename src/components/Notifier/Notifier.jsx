import React from "react";

const Notifier = ({ useNumber, number }) => {
  return (
    <div>
      {useNumber ? (
        <div className="absolute top-0 right-0 flex justify-center items-center menuNotifier">
          <span className="bg-red-500 text-white text-xs px-1 absolute right-0 rounded">
            {number}
          </span>
        </div>
      ) : (
        <div className="absolute top-0 right-0 flex justify-center items-center">
          <span className="w-2 h-2 bg-red-500 z-10 absolute right-1 rounded-full animate-pulse-size"></span>
          <span className="w-4 h-4 bg-red-50 border-2 border-red-300 block right-1 rounded-full animate-grow-and-fade"></span>
        </div>
      )}
    </div>
  );
};

export default Notifier;
