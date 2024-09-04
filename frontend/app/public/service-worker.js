self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("Push Data", data);
  const options = {
    body: data.body,
    icon: "./gigsflix_logo_white.png",
    badge: "./gigsflix_logo_white.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/earn"));
});
