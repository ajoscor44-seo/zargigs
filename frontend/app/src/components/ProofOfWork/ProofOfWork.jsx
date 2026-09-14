import React, { useState } from "react";
import formatDate from "../../hooks/formatDate";
import Modal from "../Modal/Modal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import TextAreaModal from "../TextAreaModal/TextAreaModal";
import { FiCheck, FiX, FiEye, FiExternalLink, FiClock, FiUser } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa6";

const ProofOfWork = ({ proof, setChange, setError }) => {
  const { fetchUserData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonModalState, setReasonModalState] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const status = (proof?.status || "pending").toLowerCase();

  const statusBadge =
    status === "approved"
      ? { bg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20", label: "Approved" }
      : status === "rejected" || status === "disapproved"
      ? { bg: "bg-rose-500/10 text-rose-700 border-rose-500/20", label: "Disapproved" }
      : { bg: "bg-amber-500/10 text-amber-700 border-amber-500/20", label: "Pending Review" };

  const toggleProof = () => {
    setIsOpen(!isOpen);
  };

  const sanctionTask = async (sanctionVal, customReason = "") => {
    try {
      setActionLoading(true);
      const actionStr = sanctionVal === 1 || sanctionVal === "approve" ? "approve" : "reject";

      const payload = {
        id: proof?.id || proof?._id,
        sanction: actionStr,
        parentId: proof?.parentId || proof?.task_id || proof?.taskId,
        userId: proof?.userId || proof?.user_id,
        reward: proof?.reward || 100,
        reason: customReason || reason || "",
      };

      const response = await axios.put("/api/v1/tasks/sanction-task", payload);

      if (response.data?.failed) {
        setError(response.data.message || "Failed to update proof status.");
      } else {
        await fetchUserData();
        if (setChange) setChange(Date.now());
      }
    } catch (err) {
      console.error("sanctionTask error:", err);
      if (setError) setError(err.response?.data?.message || "Failed to sanction task.");
    } finally {
      setActionLoading(false);
    }
  };

  const checkReason = async (text, setModalError) => {
    setReason(text);
    if (!text) {
      return setModalError(
        `Please, input a reason for disapproving @${proof?.username || proof?.posterUsername}'s proof.`
      );
    }
    if (text.length < 5) {
      return setModalError("Reason must be at least 5 characters long.");
    }
    setReasonModalState(false);
    await sanctionTask(0, text);
    setReason("");
  };

  const imageSrc = proof?.imageUrl || proof?.image_proof || proof?.imageProof || proof?.image;

  return (
    <>
      <TextAreaModal
        title="Reason for Disapproval"
        description={`Please input a reason for disapproving @${proof?.username || proof?.posterUsername}'s proof.`}
        isAdding={false}
        text={reason}
        setText={setReason}
        visible={reasonModalState}
        btnText={"Submit Disapproval"}
        handleVisibility={() => setReasonModalState(!reasonModalState)}
        postText={checkReason}
      />

      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-primary">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={
                proof?.posterImage ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              }
              alt="User profile"
              className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-2xs"
            />
            {status === "approved" && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px]">
                <FiCheck />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                @{proof?.username || proof?.username_proof || proof?.posterUsername || "Earner"}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${statusBadge.bg}`}
              >
                {statusBadge.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {formatDate(proof?.createdAt || proof?.created_at)}
              </span>
              {proof?.posterUsername && proof?.posterUsername !== proof?.username && (
                <span className="text-slate-500 font-semibold">
                  Account: @{proof?.posterUsername}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {imageSrc && (
            <button
              type="button"
              onClick={toggleProof}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FiEye size={14} className="text-slate-500" />
              <span>View Screenshot</span>
            </button>
          )}

          {actionLoading ? (
            <div className="p-2">
              <FaSpinner className="animate-spin text-emerald-600" size={18} />
            </div>
          ) : status === "pending" || status === "in-review" || status === "submitted" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReasonModalState(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-all flex items-center gap-1 cursor-pointer"
              >
                <FiX size={14} />
                <span>Disapprove</span>
              </button>
              <button
                type="button"
                onClick={() => sanctionTask(1)}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <FiCheck size={14} />
                <span>Approve</span>
              </button>
            </div>
          ) : status === "approved" ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-1">
              <FiCheck size={14} />
              <span>Approved</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 flex items-center gap-1">
              <FiX size={14} />
              <span>Disapproved</span>
            </span>
          )}
        </div>

        {isOpen && imageSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-4 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-600">
                  Proof by @{proof?.username || proof?.posterUsername}
                </span>
                <button
                  type="button"
                  onClick={toggleProof}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="overflow-auto flex-1 flex items-center justify-center rounded-2xl bg-slate-950/5 p-2">
                <img
                  src={imageSrc}
                  alt="Proof Screenshot"
                  className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <a
                  href={imageSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <FiExternalLink size={13} />
                  <span>Open Full Image</span>
                </a>
                <button
                  type="button"
                  onClick={toggleProof}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProofOfWork;
