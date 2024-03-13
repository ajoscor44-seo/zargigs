import React from "react";
import BackNav from "../components/BackNav/BackNav";
import Disclaimer from "../components/Disclaimer/Disclaimer";
import SupportMsg from "../components/SupportMsg/SupportMsg";
import Supports from "../components/Supports/Supports";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import Chat from "../components/Chat/Chat";

const HelpSupport = () => {
  const disclaimerMsg =
    "Please disregard any social media platform or Facebook Groups posing as Gigsflix. We do not have any Whatsapp Group or Telegram Group. Beware of Fraudsters posing as Gigsflix agents or customer supports telling you to pay any amount of money into their personal accounts or into any OPAY/PALMPAY account. We DO NOT have an OPAY/PALMPAY account number.";

  return (
    <div className="flex flex-col">
      <BackNav pageName={"Help and Support"} />
      <div className="underBackNav">
        <Disclaimer disclaimerMsg={disclaimerMsg} />
        <SupportMsg />
        <Supports />
        <Chat />
      </div>
    </div>
  );
};

export default HelpSupport;
