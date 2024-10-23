import React from "react";

const NotAvailable = ({ message }) => {
  return (
    <div className="min-h-[72vh] flex flex-col gap-2 text-center justify-center items-center px-4 text-gray-600">
      <h1 className="text-lg font-semibold">
        Feature Is Currently Not Available
      </h1>
      <p className="text-sm">
        Sorry, the feature you are looking for is not available at the moment.
      </p>
      <p className="text-md text-orange-500">{message}</p>
    </div>
  );
};

export default NotAvailable;
