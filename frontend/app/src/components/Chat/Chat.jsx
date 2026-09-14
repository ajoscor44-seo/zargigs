import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

const Chat = ({ whatsappLink }) => {
  return (
    <div className="fixed bottom-22 right-4 z-40">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all group"
        title="Chat with Support"
      >
        <FaWhatsapp size={30} className="group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};

export default Chat;

