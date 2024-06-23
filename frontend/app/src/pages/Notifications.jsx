import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import Notification from "../components/Notification/Notification";
import allNotifications from "../data/notifications";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const Notifications = () => {
  const [notifications, setNotifications] = useState(allNotifications);

  // setNotifications([{}]);

  return (
    <div>
      <BackNav pageName={"Notifications"} />
      <div className="underBackNav mb-20">
        {notifications.map((notification) => {
          return <Notification notification={notification} />;
        })}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default Notifications;
