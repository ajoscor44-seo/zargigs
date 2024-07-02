import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

const Chat = () => {
  const whatsappLink = "https://www.whatsapp.com";

  return (
    <div className="fixed bottom-20 right-3 cursor-pointer">
      <a href={whatsappLink} className="mb-2" target="_blank">
        <div className="text-sm flex flex-col items-center cursor-pointer">
          <FaWhatsapp className="text-green-500" size={55} />
        </div>
      </a>
    </div>
  );
};

export default Chat;
