import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { PiWalletLight } from "react-icons/pi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Notifier from "../Notifier/Notifier";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const ClientMenuBar = () => {
  const { currentUser } = useAuth();
  const [totalNormalTask, setTotalNormalTasks] = useState(0);
  const [totalAdvertTask, setTotalAdvertTasks] = useState(0);

  const getTotalEngagementTasks = async () => {
    return await axios
      .get(`/api/v1/tasks/total?type=engagement`)
      .then((response) => setTotalNormalTasks(response.data.total))
      .catch((error) => console.error(error));
  };

  const getTotalAdvertTasks = async () => {
    return await axios
      .get(`/api/v1/tasks/total?type=advert`)
      .then((response) => setTotalAdvertTasks(response.data.total))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getTotalEngagementTasks();
    getTotalAdvertTasks();
  }, [totalNormalTask, totalAdvertTask]);

  return (
    <div className="fixed bottom-0 bg-white w-full py-2 px-5 border-t flex justify-between">
      <Link to="/dashboard">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <FaHome
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Home</span>
        </div>
      </Link>
      <Link to={currentUser.isMember ? "/earn" : "/become-a-member"}>
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <PiWalletLight
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Earn</span>
          {totalAdvertTask || totalNormalTask ? <Notifier /> : <div></div>}
        </div>
      </Link>
      <Link to="/advertise">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <IoIosAddCircleOutline
            size={25}
            className="hover:bg-slate-200 bg-slate-100 w-8 h-8 rounded-full p-1"
          />
          <span className="text-sm">Advertise</span>
        </div>
      </Link>
      <Link to="/order">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <IoCartOutline
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Order</span>
          {!totalNormalTask ? <Notifier /> : <div></div>}
        </div>
      </Link>
      <Link to="/account-settings">
        <div className="flex flex-col justify-between items-center cursor-pointer relative">
          <FaRegUser
            size={25}
            className="bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full p-2"
          />
          <span className="text-sm">Me</span>
          {totalNormalTask ? (
            <Notifier useNumber={true} number={97} />
          ) : (
            <div></div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ClientMenuBar;
