import { useState } from "react";
import logger from "../../../backend/api/V1/utils/logger.util";
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

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("/sw.js");
    if (notificationStatus === "default") {
      requestNotificationPermission(registration);
    }
  }
}

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

const sendSubscriptionToServer = async (subscription) => {
  try {
    await axios.post("/api/v1/subscribe", subscription);
  } catch (error) {
    logger.error("Error saving subscription to DB", error);
  }
};
