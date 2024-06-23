import React, { useEffect, useState } from "react";
import { TfiHelpAlt } from "react-icons/tfi";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const ClientNavbar = () => {
  const { currentUser, adminData } = useAuth();
  const [userImageURL, setUserImageURL] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [newNotificationsNumber, setNewNotificationsNumber] = useState();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/v1/notifications");
      const data = response.data;
      const notifications = data.data;
      console.log(notifications);
      const unreadNotifications = notifications.length
        ? notifications.filter((notification) => !notification.read)
        : notifications;
      console.log(unreadNotifications);
      return setNewNotificationsNumber(unreadNotifications.length);
    } catch (error) {
      console.error(error);
    }
  };

  // Updates user profile
  useEffect(() => {
    if (currentUser?.image) {
      return setUserImageURL(currentUser?.image);
    }
    fetchNotifications();
  }, [currentUser]);

  return (
    <div className="bg-white border fixed w-full top-0 lg:hidden p-4 flex items-center justify-between z-30">
      <Link to="#">
        <div className="flex items-center gap-2">
          <img
            className="w-8 rounded-full overflow-hidden border border-green-500"
            src={adminData?.appLogo}
          />
          <span className="text-2xl font-semibold font-primary uppercase">
            {adminData?.appName}.
          </span>
        </div>
      </Link>
      <div className="font-primary flex items-center gap-3">
        <Link to="/help-support">
          <div className=" hover:text-green-500">
            <TfiHelpAlt size={25} />
          </div>
        </Link>

        <Link to="/notifications">
          <div className=" hover:text-green-500 relative p-2">
            <IoNotificationsOutline
              size={25}
              className="transition-colors duration-500"
            />
            {newNotificationsNumber ? (
              <span className="absolute top-0 right-0 bg-red-500 w-5 h-4 flex justify-center items-center text-white text-sm rounded-sm">
                {newNotificationsNumber}
              </span>
            ) : null}
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
