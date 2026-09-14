import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useParams, Link } from "react-router-dom/cjs/react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import numeral from "numeral";
import {
  FaArrowLeft,
  FaCheck,
  FaXmark,
  FaSpinner,
  FaFileCsv,
  FaImage,
  FaEye,
  FaUsers,
  FaShieldHalved,
  FaCircleCheck,
  FaClock,
} from "react-icons/fa6";
import { MdPoll, MdOutlineRateReview } from "react-icons/md";
import { supabase } from "../config/supabase.config";

const CreatorTaskManage = () => {
  const { taskId } = useParams();
  const { currentUser } = useAuth();

  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [subToReject, setSubToReject] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      // 1. Try backend API
      const res = await axios.get(`/api/v1/marketplace/creator/tasks/${taskId}/submissions`).catch(() => null);
      if (res?.data?.success && res.data.data) {
        setTask(res.data.data.task);
        setSubmissions(res.data.data.submissions || []);
        return;
      }

      // 2. Direct Supabase Fallback
      const { data: taskData } = await supabase
        .from("marketplace_tasks")
        .select("*")
        .eq("id", taskId)
        .maybeSingle();

      if (taskData) {
        setTask(taskData);
      }

      const { data: subsData } = await supabase
        .from("task_submissions")
        .select(`
          *,
          worker:worker_id (
            id,
            firstname,
            lastname,
            username,
            avatar_url
          )
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (subsData) {
        setSubmissions(subsData);
      }
    } catch (err) {
      console.error("fetchSubmissions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [taskId]);

  const handleReview = async (submissionId, decision, reason = "") => {
    try {
      setReviewingId(submissionId);

      // 1. Try backend API
      const res = await axios.post(`/api/v1/marketplace/creator/submissions/${submissionId}/review`, {
        decision,
        rejectionReason: reason,
      }).catch(() => null);

      if (res?.data?.success) {
        setFeedbackMsg(res.data.message);
        setShowRejectModal(false);
        setSubToReject(null);
        setRejectionReason("");
        fetchSubmissions();
        return;
      }

      // 2. Direct Supabase Fallback
      const subToUpdate = submissions.find((s) => s.id === submissionId);
      const isApproved = decision === "approved";

      const updatePayload = {
        status: isApproved ? "approved" : "rejected",
        reviewed_at: new Date().toISOString(),
        ...(isApproved ? {} : { rejection_reason: reason }),
      };

      await supabase
        .from("task_submissions")
        .update(updatePayload)
        .eq("id", submissionId);

      if (isApproved && subToUpdate?.worker_id) {
        // Credit worker balance
        const { data: workerData } = await supabase
          .from("users")
          .select("id, balance")
          .eq("id", subToUpdate.worker_id)
          .maybeSingle();

        const rewardAmount = parseFloat(subToUpdate.reward_amount || task?.reward_per_worker || 0);
        if (workerData && rewardAmount > 0) {
          await supabase
            .from("users")
            .update({ balance: parseFloat(workerData.balance || 0) + rewardAmount })
            .eq("id", subToUpdate.worker_id);
        }

        // Notification to worker
        try {
          await supabase.from("notifications").insert({
            user_id: subToUpdate.worker_id,
            title: "Task Submission Approved! 🎉",
            message: `Your proof for "${task?.title || "Task"}" has been approved! ₦${rewardAmount} credited to your wallet.`,
          });
        } catch {}
      }

      setFeedbackMsg(isApproved ? "Submission approved and worker credited!" : "Submission rejected.");
      setShowRejectModal(false);
      setSubToReject(null);
      setRejectionReason("");
      fetchSubmissions();
    } catch (err) {
      alert(err.message || "Failed to update review.");
    } finally {
      setReviewingId(null);
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/v1/marketplace/creator/tasks/${taskId}/export-csv`, "_blank");
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter((s) => s.status === "approved" || s.status === "auto_approved").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

  return (
    <ClientLayout>
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 font-primary">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <FaArrowLeft size={12} />
            <span>Back to Dashboard</span>
          </Link>

          {task?.has_survey && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <FaFileCsv size={14} className="text-emerald-400" />
              <span>Export Survey Responses (CSV)</span>
            </button>
          )}
        </div>

        {/* Task Overview Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {task?.category?.replace(/_/g, " ")} Campaign
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                {task?.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Unit Reward</span>
                <span className="text-base font-black text-emerald-600">₦{task?.reward_per_worker}</span>
              </div>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-xs text-slate-500 font-semibold block">Total Submissions</span>
              <span className="text-xl font-black text-slate-900">{submissions.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60">
              <span className="text-xs text-amber-700 font-semibold block">Pending Review</span>
              <span className="text-xl font-black text-amber-800">{pendingCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60">
              <span className="text-xs text-emerald-700 font-semibold block">Approved & Paid</span>
              <span className="text-xl font-black text-emerald-800">{approvedCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/60">
              <span className="text-xs text-rose-700 font-semibold block">Rejected</span>
              <span className="text-xl font-black text-rose-800">{rejectedCount}</span>
            </div>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Submissions Review Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Worker Submissions ({submissions.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <FaSpinner className="animate-spin text-emerald-600 mx-auto mb-2" size={20} />
              <span>Loading submissions...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs sm:text-sm">
              No worker submissions received yet. As workers complete the task, they will appear here for review.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/70">
                  <tr>
                    <th className="px-6 py-4">Worker</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Evidence</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {sub.worker?.username || "Worker"}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedSub(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          <FaEye size={12} />
                          <span>View Proof</span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            sub.status === "approved" || sub.status === "auto_approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : sub.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {sub.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleReview(sub.id, "approved")}
                              disabled={reviewingId === sub.id}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSubToReject(sub);
                                setShowRejectModal(true);
                              }}
                              disabled={reviewingId === sub.id}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold cursor-pointer disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Proof Inspection Modal */}
        {selectedSub && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-lg text-slate-900">
                  Submission Proof: {selectedSub.worker?.username}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
                >
                  <FaXmark size={18} />
                </button>
              </div>

              {selectedSub.proof_text && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Worker Notes</div>
                  <p className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 whitespace-pre-line font-mono">
                    {selectedSub.proof_text}
                  </p>
                </div>
              )}

              {/* Survey Answers */}
              {selectedSub.survey_answers && Object.keys(selectedSub.survey_answers).length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Survey Responses</div>
                  <div className="space-y-2">
                    {Object.entries(selectedSub.survey_answers).map(([qKey, ans], idx) => (
                      <div key={qKey} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-slate-800">Q{idx + 1}:</span>
                        <div className="text-emerald-800 font-semibold">
                          {Array.isArray(ans) ? ans.join(", ") : String(ans)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Uploads */}
              {selectedSub.proof_urls?.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Uploaded Proof Images</div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSub.proof_urls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt="Proof" className="w-full h-36 object-cover rounded-xl border border-slate-200" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && subToReject && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">
                Reject Submission
              </h3>
              <p className="text-xs text-slate-500">
                Please specify why this work does not meet instructions. The worker will be notified and can dispute if unfair.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Rejection Reason *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="">-- Select a reason --</option>
                  <option value="Incorrect or incomplete screenshot">Incorrect or incomplete screenshot</option>
                  <option value="Did not follow task instructions">Did not follow task instructions</option>
                  <option value="Duplicate or fraudulent submission">Duplicate or fraudulent submission</option>
                  <option value="Incomplete survey answers">Incomplete survey answers</option>
                  <option value="Invalid username / handle provided">Invalid username / handle provided</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReview(subToReject.id, "rejected", rejectionReason)}
                  disabled={!rejectionReason}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ClientLayout>
  );
};

export default CreatorTaskManage;
