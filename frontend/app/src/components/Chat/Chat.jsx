import React from "react";
import { IoChatbubbles } from "react-icons/io5";

const Chat = () => {
  return (
    <button className="fixed bottom-20 right-3 cursor-pointer">
      <IoChatbubbles
        size={25}
        className="text-green-500 shadow-2xl bg-transparent w-14 h-14"
      />
    </button>
  );
};

export default Chat;
