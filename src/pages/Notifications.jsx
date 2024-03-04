import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import Notification from "../components/Notification/Notification";
import icon from "../assets/images/businessman-talking-phone-2.png";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      message:
        "Great news! Your order with order ID #123456 has been successfully shipped. You can track your shipment with the tracking number we've sent in a separate email.",
      title: "Order Shipped",
      iconPath: icon,
    },
    {
      message:
        "We're happy to confirm that we've received your payment for invoice #78910. Thank you for your prompt payment, and we hope you enjoy your purchase!",
      title: "Payment Received",
      iconPath: icon,
    },
    {
      message:
        "You've received a new message from Jane Doe regarding your recent inquiry. Please log in to your account to read the message and respond at your earliest convenience.",
      title: "New Message",
      iconPath: icon,
    },
    {
      message:
        "This is a friendly reminder that your subscription for Premium Services is set to expire in 10 days. Don't miss out on uninterrupted service—renew your subscription today!",
      title: "Subscription Notice",
      iconPath: icon,
    },
    {
      message:
        "We're excited to announce that a new version of our app is now available! This update includes new features, performance improvements, and bug fixes to enhance your experience.",
      title: "Update Available",
      iconPath: icon,
    },
  ]);

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
