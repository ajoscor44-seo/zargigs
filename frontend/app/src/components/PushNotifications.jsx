import { MdDangerous } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";

const sendSubscriptionToServer = async (subscription) => {
  try {
    await axios.post("/api/v1/subscribe", subscription);
  } catch (error) {
    console.error("Error saving subscription to DB", error);
  }
};

export const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export async function subscribeUser(registration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUB_KEY
      ),
    });

    await sendSubscriptionToServer(subscription);
  } catch (error) {
    console.error(error.message);
  }
}

const PushNotifications = () => {
  const [notificationStatus, setNotificationStatus] = useState(
    Notification.permission
  );

  const requestNotificationPermission = (registration) => {
    Notification.requestPermission().then((permission) => {
      setNotificationStatus(permission);

      if (permission === "granted") {
        subscribeUser(registration);
      } else if (permission === "denied") {
        alert(
          "You have blocked notifications. Please enable them in your browser settings."
        );
      }
    });
  };

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          if (notificationStatus === "default") {
            requestNotificationPermission(registration);
          }
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    };

    registerServiceWorker();
  }, [notificationStatus]);

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

export default PushNotifications;
