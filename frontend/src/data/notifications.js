const allNotifications = [
  {
    message:
      "Great news! Your order with order ID #123456 has been successfully shipped. You can track your shipment with the tracking number we've sent in a separate email.",
    title: "Order Shipped",
    type: "announcement",
    read: false,
  },
  {
    message:
      "We're happy to confirm that we've received your payment for invoice #78910. Thank you for your prompt payment, and we hope you enjoy your purchase!",
    title: "Payment Received",
    type: "task",
    read: true,
  },
  {
    message:
      "You've received a new message from Jane Doe regarding your recent inquiry. Please log in to your account to read the message and respond at your earliest convenience.",
    title: "New Message",
    type: "advert",
    read: true,
  },
  {
    message:
      "This is a friendly reminder that your subscription for Premium Services is set to expire in 10 days. Don't miss out on uninterrupted service—renew your subscription today!",
    title: "Subscription Notice",
    type: "warning",
    read: true,
  },
  {
    message:
      "We're excited to announce that a new version of our app is now available! This update includes new features, performance improvements, and bug fixes to enhance your experience.",
    title: "Update Available",
    type: "verification",
    read: true,
  },
  {
    message:
      "We're excited to announce that a new version of our app is now available! This update includes new features, performance improvements, and bug fixes to enhance your experience.",
    title: "Update Available",
    type: "fund",
    read: true,
  },
  {
    message:
      "We're excited to announce that a new version of our app is now available! This update includes new features, performance improvements, and bug fixes to enhance your experience.",
    title: "Update Available",
    type: "withdraw",
    read: true,
  },
];

export default allNotifications;
