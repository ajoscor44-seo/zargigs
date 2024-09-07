import { MdDangerous } from "react-icons/md";

const PushNotifications = ({ notificationStatus }) => {
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
