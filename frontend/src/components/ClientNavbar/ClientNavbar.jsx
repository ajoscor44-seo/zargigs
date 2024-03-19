import React, { useEffect, useState } from "react";
import logo from "../../assets/png/logo-color.png";
import { TfiHelpAlt } from "react-icons/tfi";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import allNotifications from "../../data/notifications";
import { useAuth } from "../../context/AuthContext";

const ClientNavbar = () => {
  const { currentUser } = useAuth();
  const [userImageURL, setUserImageURL] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  const [newNotificationsNumber, setNewNotificationsNumber] = useState(
    allNotifications.length
  );

  useEffect(() => {
    if (currentUser.image) {
      return setUserImageURL(currentUser.image);
    }
  }, [currentUser]);

  return (
    <div className="bg-white border fixed w-full top-0 lg:hidden p-4 flex items-center justify-between">
      <Link to="#">
        <div className="flex items-center gap-2">
          <img className="w-8 rounded" src={logo} />
          <span className="text-2xl font-semibold font-primary">GIGSFLIX.</span>
        </div>
      </Link>
      <div className="font-primary flex items-center gap-3">
        <Link to="/help-support">
          <div className=" hover:text-primaryLight">
            <TfiHelpAlt size={25} />
          </div>
        </Link>

        <Link to="/notifications">
          <div className=" hover:text-primaryLight relative p-2">
            <IoNotificationsOutline
              size={25}
              className="transition-colors duration-500"
            />
            <span className="absolute top-0 right-0 bg-red-500 w-5 h-4 flex justify-center items-center text-white text-sm rounded-sm">
              {newNotificationsNumber}
            </span>
          </div>
        </Link>

        <Link to="/user-details">
          <div className="hover:opacity-80">
            <img
              src={userImageURL}
              alt="Profile Picture"
              className="w-10 h-10 border rounded-full"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ClientNavbar;
