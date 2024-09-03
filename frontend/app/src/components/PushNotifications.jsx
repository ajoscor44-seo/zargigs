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

  const subscribeUser = () => {
    navigator.serviceWorker.ready.then((registration) => {
      const publicKey = import.meta.env.VITE_VAPID_PUB_KEY;
      if (!publicKey) {
        throw new Error("VAPID public key is missing");
      }
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        })
        .then((subscription) => {
          console.log("Subscription", subscription);
          sendSubscriptionToServer(subscription);
        })
        .catch((error) => {
          console.error("Failed to subscribe the user:", error);
        });
    });
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
    await axios.post("/api/v1/subscribe", subscription);
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
