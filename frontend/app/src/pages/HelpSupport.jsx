import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import Disclaimer from "../components/Disclaimer/Disclaimer";
import SupportMsg from "../components/SupportMsg/SupportMsg";
import Supports from "../components/Supports/Supports";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import Chat from "../components/Chat/Chat";
import axios from "axios";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";

const HelpSupport = () => {
  const disclaimerMsg =
    "Please disregard any social media platform or Facebook Groups posing as Gigsflix. We do not have any Whatsapp Group or Telegram Group. Beware of Fraudsters posing as Gigsflix agents or customer supports telling you to pay any amount of money into their personal accounts or into any OPAY/PALMPAY account. We DO NOT have an OPAY/PALMPAY account number.";

  const [visible, setVisibility] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(false);
  const [complaint, setcomplaint] = useState({});

  const postComplaint = async () => {
    try {
      const response = await axios.post("/api/v1/admin/complaints", complaint);
    } catch (error) {
      setIsAdding(false);
      return setError(error);
    }
  };

  const handleVisibility = () => {
    return setVisibility(!visible);
  };
  return (
    <div className="flex flex-col">
      <BackNav pageName={"Help and Support"} />
      <div className="underBackNav mb-20">
        <Disclaimer disclaimerMsg={disclaimerMsg} />
        <SupportMsg />
        <Supports />
        <Chat handleVisibility={handleVisibility} />
      </div>
      <Modal
        show={visible}
        onHide={() => handleVisibility(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Having A Problem With Gigsflix?</Modal.Title>
        </Modal.Header>
        <Modal.Header>
          {error && (
            <Alert color="red" className="w-100 text-center">
              {error}
            </Alert>
          )}
        </Modal.Header>
        <Modal.Body>Hello</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleVisibility(false)}
            disabled={isAdding}
          >
            Close
          </Button>
          <button
            className={"here_comes-the_class"}
            onClick={() => postComplaint()}
            disabled={isAdding}
          >
            {isAdding ? <Spinner /> : "Complain"}
          </button>
        </Modal.Footer>
      </Modal>
      <ClientMenuBar />
    </div>
  );
};

export default HelpSupport;
