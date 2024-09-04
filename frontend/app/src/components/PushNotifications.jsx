import axios from "axios";
import { useEffect, useState } from "react";
import { MdDangerous } from "react-icons/md";

const PushNotifications = () => {
  const [notificationStatus, setNotificationStatus] = useState(
    Notification.permission
  );

  useEffect(() => {
    if (notificationStatus === "default") {
      requestNotificationPermission();
    }
  }, [notificationStatus]);

  const requestNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotificationStatus(permission);

      if (permission === "granted") {
        subscribeUser();
      } else if (permission === "denied") {
        alert(
          "You have blocked notifications. Please enable them in your browser settings."
        );
      }
    });
  };

  const subscribeUser = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log(registration)
      const publicKey = import.meta.env.VITE_VAPID_PUB_KEY;
      console.log("Subscribing User.....");
      const subscription = await registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
      console.log("Subscription", subscription);
      await sendSubscriptionToServer(subscription);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const sendSubscriptionToServer = async (subscription) => {
    try {
      await axios.post("/api/v1/subscribe", subscription);
    } catch (error) {
      console.log("Error sending subscription to DB", error)
    }
  };

  return (
    <div>
      {notificationStatus === "denied" && (
        <p className="text-xs bg-red-200 text-red-600 py-1 px-2 font-semibold flex gap-2 items-center">
          <MdDangerous className="h-10 w-10" />
          <span>
            Notifications are blocked, enable them in your browser settings to
            get notified when task available.
          </span>
        </p>
      )}
    </div>
  );
};

// const vapidkeys = {
//   publicKey:
//     "BKTHQjnIlHvb2sS4gh1fc6gKTXayAgiAVflrxVNyeB_NuCYxU-DBDLarLuQfQlMGS-vmXDshpcWs4fKObj5_YjY",
//   privateKey: "U-rukgPSzgNfeMkyT7C9S6qeev8HYgTWZ3aQYXnTDzk",
// };

export default PushNotifications;
