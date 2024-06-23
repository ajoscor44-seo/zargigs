import React, { useState, useEffect } from "react";
import BackNav from "../components/BackNav/BackNav";
import Notification from "../components/Notification/Notification";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import axios from "axios";
import NoData from "../components/NoData/NoData";

const Notifications = () => {
  const [meta, setMeta] = useState({});
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/v1/notifications");
      const data = response.data;
      setMeta(data.meta);
      return setNotifications(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <BackNav pageName={"Notifications"} />
      <div className="underBackNav mb-20">
        {notifications.length ? (
          <div>
            {notifications.map((notification) => {
              return <Notification notification={notification} />;
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-96">
            <NoData textBelow={"No notifications"} />
          </div>
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Notifications;
