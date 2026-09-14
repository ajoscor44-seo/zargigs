import React from "react";
import {
  FiVolume2,
  FiAlertTriangle,
  FiCheckCircle,
  FiDollarSign,
  FiCreditCard,
  FiShield,
  FiBell,
  FiClock,
} from "react-icons/fi";
import { RiMegaphoneLine } from "react-icons/ri";
import formatDate from "../../hooks/formatDate";

const Notification = ({ notification, markAsRead }) => {
  const getIconAndColor = (type) => {
    switch (type) {
      case "announcement":
        return {
          icon: <FiVolume2 size={18} />,
          bg: "bg-amber-50 text-amber-600",
        };
      case "warning":
        return {
          icon: <FiAlertTriangle size={18} />,
          bg: "bg-rose-50 text-rose-600",
        };
      case "task":
        return {
          icon: <FiCheckCircle size={18} />,
          bg: "bg-emerald-50 text-emerald-600",
        };
      case "advert":
        return {
          icon: <RiMegaphoneLine size={18} />,
          bg: "bg-purple-50 text-purple-600",
        };
      case "withdraw":
        return {
          icon: <FiCreditCard size={18} />,
          bg: "bg-teal-50 text-teal-600",
        };
      case "fund":
        return {
          icon: <FiDollarSign size={18} />,
          bg: "bg-blue-50 text-blue-600",
        };
      case "verification":
        return {
          icon: <FiShield size={18} />,
          bg: "bg-emerald-50 text-emerald-600",
        };
      default:
        return {
          icon: <FiBell size={18} />,
          bg: "bg-slate-100 text-slate-600",
        };
    }
  };

  const { icon, bg } = getIconAndColor(notification.type);

  return (
    <div
      onClick={() => markAsRead(notification._id || notification.id, notification.read)}
      className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-slate-50/80 ${
        !notification.read ? "bg-emerald-50/20" : ""
      }`}
    >
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4
            className={`text-xs sm:text-sm font-bold truncate ${
              !notification.read ? "text-slate-900" : "text-slate-700"
            }`}
          >
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          )}
        </div>

        <p className="text-xs text-slate-500 font-normal leading-relaxed mb-2">
          {notification.message}
        </p>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <FiClock size={12} />
          <span>{formatDate(notification.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default Notification;

