import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";

const BackNav = ({ pageName, pathToGo, usePath }) => {
  const history = useHistory();

  const goBack = () => {
    if (usePath) {
      return;
    }
    history.goBack();
  };

  return (
    <div className="bg-white z-10 py-3 px-4 flex fixed w-full items-center gap-3 border-b">
      <Link to={pathToGo ? pathToGo : ""}>
        <div className="hover:bg-slate-100 p-2 rounded-full">
          <IoIosArrowBack size={20} onClick={goBack} />
        </div>
      </Link>
      <span className="font-semibold font-primary text-md">{pageName}</span>
    </div>
  );
};

export default BackNav;
