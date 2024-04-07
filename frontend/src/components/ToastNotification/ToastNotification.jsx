import React, { useRef } from "react";
import "./ToastNotification.css";
import { FaCircleCheck } from "react-icons/fa6";
import { TiDelete, TiWarning } from "react-icons/ti";

const ToastNotification = ({ toastNotification }) => {
  return (
    <div className="toast_container">
      <div
        className="toast_box"
        style={{
          color: `var(--${toastNotification.errorType})`,
          borderInlineStart: `4px solid var(--${toastNotification.errorType})`,
        }}
      >
        <div className="toast_info">
          <div className="toast_icon">
            {toastNotification.errorType === "success" ? (
              <FaCircleCheck size={25} />
            ) : toastNotification.errorType === "danger" ? (
              <TiDelete size={25} />
            ) : (
              <TiWarning size={25} />
            )}
          </div>
          <div>{toastNotification?.msg}</div>
        </div>
        <div
          className="toast_timeline"
          style={{
            content: "''",
            position: "absolute",
            left: "4px",
            bottom: "0",
            width: "100%",
            height: "3px",
            background: `var(--${toastNotification.errorType})`,
            animation: "toastLoad 3s linear forwards",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ToastNotification;
