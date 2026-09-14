import axios from "axios";
import React, { useEffect, useState } from "react";
import { GiSpeaker } from "react-icons/gi";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(null);

  const getAnnouncements = async () => {
    try {
      const response = await axios.get("/api/v1/announcement");

      if (response.data && !response.data.failed && Array.isArray(response.data.data)) {
        setAnnouncements(response.data.data);
      }
    } catch (err) {
      // Gracefully ignore error
    }
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  return (
    <div>
      {announcements ? (
        announcements.map((announcement) => {
          return (
            <div
              key={announcement?.id}
              className="flex justify-center items-center bg-orange-100 text-orange-400 my-2 mx-4 ps-2 pe-3 rounded-full"
            >
              <span className="pe-2">
                <GiSpeaker size={25} />
              </span>
              <marquee
                style={{ maxHeight: "80px" }}
                className="font-semibold text-sm py-1"
              >
                {announcement?.announcement}
              </marquee>
            </div>
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Announcements;
