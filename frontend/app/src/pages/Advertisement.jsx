import React from "react";
import BackNav from "../components/BackNav/BackNav";

const Advertisement = () => {
  return (
    <div>
      <BackNav
        pageName={"Manage Advertisement"}
        usePath={true}
        pathToGo={"/"}
      />
    </div>
  );
};

export default Advertisement;
