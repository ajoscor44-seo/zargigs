import React from "react";
import "./ToastNotification.css";
import { FaCircleCheck, FaCircleXmark, FaTriangleExclamation } from "react-icons/fa6";

const ToastNotification = ({ toastNotification }) => {
  const isSuccess = toastNotification?.errorType === "success";
  const isDanger =
    toastNotification?.errorType === "danger" ||
    toastNotification?.errorType === "error" ||
    toastNotification?.errorType === "failed";

  return (
    <div className="toast_item">
      <div
        className={`toast_card ${
          isSuccess
            ? "toast_success"
            : isDanger
            ? "toast_danger"
            : "toast_warning"
        }`}
      >
        <div className="toast_icon_wrap">
          {isSuccess ? (
            <FaCircleCheck className="toast_icon_svg icon_success" />
          ) : isDanger ? (
            <FaCircleXmark className="toast_icon_svg icon_danger" />
          ) : (
            <FaTriangleExclamation className="toast_icon_svg icon_warning" />
          )}
        </div>

        <div className="toast_body">
          <div className="toast_badge">
            {isSuccess ? "Success" : isDanger ? "Error" : "Notice"}
          </div>
          <p className="toast_msg">
            {toastNotification?.msg || toastNotification?.message || "Notification"}
          </p>
        </div>

        <div
          className={`toast_progress_bar ${
            isSuccess ? "progress_success" : isDanger ? "progress_danger" : "progress_warning"
          }`}
        />
      </div>
    </div>
  );
};

export default ToastNotification;
