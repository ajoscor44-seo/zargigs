import React from "react";
import BackNav from "../components/BackNav/BackNav";

const EditProfile = () => {
  return (
    <div>
      <BackNav
        pageName={"Edit Profile"}
        usePath={true}
        pathToGo={"/account-settings"}
      />
    </div>
  );
};

export default EditProfile;
