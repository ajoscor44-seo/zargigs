import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import Notification from "../components/Notification/Notification";
// import icon from "../assets/images/businessman-talking-phone-2.png";
import allNotifications from "../data/notifications";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";

const Notifications = () => {
  const [notifications, setNotifications] = useState(allNotifications);

  // setNotifications([{}]);

  return (
    <div>
      <BackNav pageName={"Notifications"} />
      <div className="underBackNav">
        {notifications.map((notification) => {
          return <Notification notification={notification} />;
        })}
      </div>
    </div>
  );
};

export default Notifications;
