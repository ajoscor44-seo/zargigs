import React from "react";
import icon from "../../assets/images/businessman-talking-phone-2.png";

const Notification = ({ notification }) => {
  return (
    <div className="border hover:bg-slate-100 grid grid-flow-col gap-3 items-start font-primary p-4 cursor-pointer">
      <div className="w-fit h-fit rounded-full border-2 overflow-hidden">
        <img src={icon} className="w-12 h-12 object-cover" />
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold">{notification.title}</h2>
        <span className="text-sm">{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;
