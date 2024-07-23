import React from "react";
import { BiLike } from "react-icons/bi";
import {
  FaCommentDots,
  FaFacebook,
  FaInstagram,
  FaRetweet,
  FaShare,
  FaSpinner,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import playStoreImage from "../../assets/images/playstore-icon.png";
import { IoLogoAppleAppstore } from "react-icons/io5";
import { SiAudiomack } from "react-icons/si";
import { SlUserFollowing } from "react-icons/sl";
import { Link } from "react-router-dom/cjs/react-router-dom";
import formatDate from "../../hooks/formatDate";
import { MdGetApp } from "react-icons/md";
import ItemIcon from "../ItemIcon/ItemIcon";

const Task = ({ task }) => {
  const btnBgColor =
    task.status?.replace(/\s+/g, "")?.toLowerCase() == "pending"
      ? "bg-orange-400"
      : task.status?.replace(/\s+/g, "")?.toLowerCase() == "in-review"
      ? "bg-sky-400"
      : task.status?.replace(/\s+/g, "")?.toLowerCase() == "failed"
      ? "bg-red-400"
      : task.status?.replace(/\s+/g, "")?.toLowerCase() == "cancelled"
      ? "bg-red-500"
      : "bg-green-500";

  return (
    <div className="flex items-center px-2 py-1 border-b gap-2 font-primary">
      <ItemIcon platform={task?.taskPlatform} size={45} playstoreSize={"w-20 h-20"} />
      <div className="flex-1 flex justify-between items-center">
        <div className="flex flex-col py-1">
          <span className="methodNote text-gray-400 font-semibold">
            {formatDate(task?.createdAt)}
          </span>
          <h2 className="text-xs font-bold">{task?.title}</h2>
          <span className="methodNote font-semibold">
            Earning:{" "}
            <span className="font-extrabold">
              ₦{task?.earningPerTask} per engagement
            </span>
          </span>
        </div>
        <div>
          <Link
            to={`/earn/${task.taskType}/${null}/${task.taskPlatform}/${
              task.status
            }/${task?.id}`}
          >
            <button
              className={
                btnBgColor +
                " capitalize p-1 text-sm text-nowrap text-white rounded me-1"
              }
            >
              {task?.status == "in-review" ? (
                <FaSpinner size={20} />
              ) : (
                task?.status
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Task;
