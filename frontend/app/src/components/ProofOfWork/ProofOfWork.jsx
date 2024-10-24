import React, { useState } from "react";
import formatDate from "../../hooks/formatDate";
import Modal from "../Modal/Modal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import TextAreaModal from "../TextAreaModal/TextAreaModal";

const ProofOfWork = ({ proof, setChange, setError }) => {
  const { fetchUserData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonModalState, setReasonModalState] = useState(false);
  const textColor =
    proof?.status == "pending"
      ? "text-orange-400"
      : proof?.status == "approved"
      ? "text-green-500"
      : "text-red-500";

  const toggleProof = () => {
    return setIsOpen(!isOpen);
  };

  const sanctionTask = async (sanction) => {
    if (!reason) {
      if (!sanction) {
        return setReasonModalState(true);
      }
    }

    const response = await axios.put(
      `/api/v1/tasks/sanction-task?sanction=${sanction}&id=${proof?.id}&parentId=${proof?.parentId}` +
        (reason ? `&reason=${reason}` : "")
    );

    if (response.data.failed) {
      return setError(response.data.message);
    }

    await fetchUserData();
    return setChange(Date.now());
  };

  const checkReason = (text, setModalError) => {
    setReason(text);
    if (!text) {
      return setModalError(
        `Please, input a reason for disapproving ${proof?.posterUsername}'s proof.`
      );
    }
    if (text.length < 10) {
      return setModalError("Reason must be at least 10 characters long.");
    }
    setError("");
    setReasonModalState(false);
    sanctionTask(0);
    return setReason("");
  };

  return (
    <>
      <TextAreaModal
        title="Reason for Disapproval"
        description={`Please, input a reason for disapproving ${proof?.posterUsername}'s proof.`}
        isAdding={false}
        text={reason}
        setText={setReason}
        visible={reasonModalState}
        btnText={"Submit"}
        handleVisibility={() => setReasonModalState(!reasonModalState)}
        postText={checkReason}
      />
      <div className="bg-white shadow-2xl mx-2 font-bold p-2 rounded mb-5 flex gap-2">
        <div className="max-w-fit max-h-fit">
          <div className="border-2 border-green-500 w-fit rounded-full">
            <img
              src={
                proof?.posterImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="User profile"
              className="w-14 h-14 rounded-full border-2"
            />
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <span className="text-gray-400 text-xs text-nowrap">
            {formatDate(proof?.createdAt)}
          </span>
          <span className="text-green-500 text-sm font-semibold">
            @{proof?.username}
          </span>
          <span className="text-gray-500 text-xs">
            @{proof?.posterUsername}
          </span>
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <div className="flex justify-end gap-2 items-center">
            <span
              className={
                textColor + " text-gray-400 text-xs text-end capitalize"
              }
            >
              {proof?.status}
            </span>
            <span
              onClick={toggleProof}
              className="text-xs text-end font-semibold hover:underline text-sky-500 py-1 px-2 rounded-sm cursor-pointer"
            >
              View
            </span>
          </div>

          {proof?.status == "pending" ? (
            <div className="flex items-center gap-2">
              <span
                onClick={() => sanctionTask(0)}
                className="text-xs text-end bg-red-500 py-1 px-2 text-white rounded-sm cursor-pointer"
              >
                Disapprove
              </span>
              <span
                onClick={() => sanctionTask(1)}
                className="text-xs text-end bg-green-500 py-1 px-2 text-white rounded-sm cursor-pointer"
              >
                Approve
              </span>
            </div>
          ) : proof?.status == "approved" ? (
            <span className="text-xs text-end bg-green-500 py-1 px-2 text-white rounded cursor-pointer w-fit self-end">
              Approved
            </span>
          ) : (
            <span className="text-xs text-end bg-red-500 py-1 px-2 text-white rounded cursor-pointer w-fit self-end">
              Disapproved
            </span>
          )}
        </div>
        {isOpen && (
          <div className="fixed top-0 left-0 h-screen w-screen">
            <Modal
              content={
                <img
                  alt="Proof Screenshot"
                  style={{ maxHeight: "800px" }}
                  src={proof?.imageUrl}
                />
              }
              posBtnText={"Ok"}
              negBtnText={"Close"}
              onPosClick={toggleProof}
              onNegClick={toggleProof}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProofOfWork;
