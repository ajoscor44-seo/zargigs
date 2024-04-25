import React, { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";

const useListenRecentActivity = (setRecentActivities, recentActivities) => {
  const { socket } = useSocketContext();
  // const

  useEffect(() => {
    socket?.on("newRecentActivity", (newRecentActivity) => {
      setRecentActivities([newRecentActivity, ...recentActivities]);
    });

    return () => socket?.off("newRecentActivity");
  }, [socket, setRecentActivities, recentActivities]);
};

export default useListenRecentActivity;
