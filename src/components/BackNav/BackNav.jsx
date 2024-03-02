import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const BackNav = ({ pageName }) => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  return (
    <div className="py-3 px-4 flex items-center gap-3 border-b">
      <div className="hover:bg-slate-100 p-2 rounded-full">
        <IoIosArrowBack size={20} onClick={goBack} />
      </div>
      <span className="font-semibold font-primary text-lg">{pageName}</span>
    </div>
  );
};

export default BackNav;
