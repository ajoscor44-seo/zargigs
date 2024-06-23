import React, { useState, useEffect } from "react";
import BackNav from "../components/BackNav/BackNav";
import Notification from "../components/Notification/Notification";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import axios from "axios";
import NoData from "../components/NoData/NoData";
import { FaSpinner } from "react-icons/fa6";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({});
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/v1/notifications?limit=${limit}`);
      const data = response.data;
      setNotifications(data.data);
      setMeta(data.meta);
      return setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNotifications();
  }, [limit]);

  return (
    <div>
      <BackNav pageName={"Notifications"} />
      <div className="underBackNav mb-20">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <FaSpinner size={25} color="green" />
          </div>
        ) : notifications.length ? (
          <div>
            <div>
              {notifications.map((notification) => {
                return <Notification notification={notification} />;
              })}
            </div>
            {meta.total > limit && (
              <div
                className="text-green-500 text-center py-2 hover:bg-slate-100 cursor-pointer text-sm"
                onClick={() => setLimit((prev) => prev + 10)}
              >
                Load more...
              </div>
            )}
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
