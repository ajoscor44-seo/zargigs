import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom/cjs/react-router-dom";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import axios from "axios";
import { FaSpinner, FaBullhorn, FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import NoData from "../components/NoData/NoData";
import numeral from "numeral";
import formatDate from "../hooks/formatDate";
import ProofOfWork from "../components/ProofOfWork/ProofOfWork";
import ItemIcon from "../components/ItemIcon/ItemIcon";

const OrderDetails = () => {
  const [loading, setLoading] = useState(true);
  const [dataChanged, setDataChanged] = useState(false);
  const [proofLoading, setProofLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState({});
  const [proofs, setProofs] = useState([]);
  const { slug, id } = useParams();

  const getTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/tasks/${slug}/${id}`);
      const raw = Array.isArray(response.data) ? response.data[0] : (response.data?.data || response.data);
      if (raw) {
        const amt = Number(raw.amountPaid ?? raw.amount_paid ?? 0);
        const qty = Number(raw.numberOfTasks ?? raw.number_of_tasks ?? 0);
        const unitCost = Number(raw.costPerTask ?? (qty > 0 && amt > 0 ? amt / qty : 0));
        const finalAmt = amt > 0 ? amt : qty * unitCost;

        setDetails({
          ...raw,
          id: raw.id || id,
          title: raw.title || (slug === "adverts" ? `Advert on ${(raw.platform || raw.taskPlatform || "WhatsApp").toUpperCase()}` : `${(raw.platform || raw.taskPlatform || "Social").toUpperCase()} Engagement`),
          taskType: raw.taskType || raw.task_type || (slug === "adverts" ? "advert" : "engagement"),
          taskPlatform: raw.taskPlatform || raw.platform || "whatsapp",
          numberOfTasks: qty,
          completedTasks: Number(raw.completedTasks ?? raw.tasksDone ?? raw.tasks_done ?? 0),
          allocatedTasks: Number(raw.allocatedTasks ?? raw.tasks_done ?? 0),
          amountPaid: finalAmt,
          costPerTask: unitCost,
          gender: raw.gender || "All Genders",
          location: raw.location || "All Nigeria",
          religion: raw.religion || "All Religions",
          status: raw.status || "pending",
          createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
          link: raw.link || raw.action_link || raw.actionLink,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getProofsOfWork = async () => {
    if (!details?.id) return;
    try {
      setProofLoading(true);
      const response = await axios.get(
        `/api/v1/tasks/proofs-of-work?type=${details?.taskType}&platform=${details?.taskPlatform}&id=${details?.id}`
      );
      if (response.data?.failed) {
        setProofLoading(false);
        return setError(response.data.message);
      }
      const rawList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setProofs(rawList);
      setProofLoading(false);
    } catch (err) {
      console.warn("getProofsOfWork error:", err);
      setProofs([]);
      setProofLoading(false);
    }
  };

  useEffect(() => {
    getTaskDetails();
  }, [id]);

  useEffect(() => {
    if (details?.id) {
      getProofsOfWork();
    }
  }, [details, dataChanged]);

  const orderStatus =
    Number(details?.numberOfTasks || 0) > 0 &&
    Number(details?.numberOfTasks || 0) <= Number(details?.completedTasks || 0)
      ? "Completed"
      : Number(details?.allocatedTasks || 0) > 0
      ? "In Progress"
      : details?.status || "Active";

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        <div className="pb-2 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Campaign Review & Proofs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Live progress analytics and submissions verification for this campaign.
            </p>
          </div>
          <Link
            to="/order-history"
            className="self-start px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            ← Order History
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[350px] flex flex-col justify-center items-center gap-3 bg-white rounded-3xl border border-slate-200/80">
            <FaSpinner size={28} className="text-emerald-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading campaign details...</p>
          </div>
        ) : !details?.id ? (
          <div className="min-h-[300px] flex justify-center items-center bg-white border border-slate-200/80 rounded-3xl p-8">
            <NoData textBelow="No details found for this campaign" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (8 cols): Top Overview, Metrics & Proof Submissions */}
            <div className="md:col-span-8 space-y-6">
              {/* Campaign Header & Metrics Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/60 p-2.5 flex items-center justify-center shrink-0">
                      <ItemIcon
                        platform={details?.taskPlatform}
                        size={32}
                        playstoreSize="w-8 h-8"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
                          {details.taskType === "advert"
                            ? `Advert on ${details.taskPlatform}`
                            : `${details.taskPlatform} Engagement`}
                        </h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Created on {formatDate(details.createdAt)} • Ref #{details.id?.substring(0, 8)}
                      </p>
                    </div>
                  </div>

                  {details.link && (
                    <a
                      href={details.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <span>Target URL</span>
                      <FaExternalLinkAlt size={10} />
                    </a>
                  )}
                </div>

                {/* 4-Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">Target Ordered</span>
                    <span className="text-lg font-black text-slate-900">
                      {numeral(details.numberOfTasks).format()} <span className="text-xs font-bold text-slate-400">posts</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">In Progress (Claimed)</span>
                    <span className="text-lg font-black text-sky-600">{numeral(details.allocatedTasks || 0).format()}</span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">Completed</span>
                    <span className="text-lg font-black text-emerald-600">{numeral(details.completedTasks || 0).format()}</span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60">
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">Amount Paid</span>
                    <span className="text-lg font-black text-slate-900">
                      ₦{numeral(Number(details.amountPaid || 0)).format("0,0.00")}
                    </span>
                  </div>
                </div>

                {/* Targeting Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/50">
                    <span className="text-slate-400 font-medium">Gender Target: </span>
                    <strong className="text-slate-800">{details.gender || "All Genders"}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/50">
                    <span className="text-slate-400 font-medium">Location Target: </span>
                    <strong className="text-slate-800">{details.location || "All Nigeria"}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/50">
                    <span className="text-slate-400 font-medium">Religion Target: </span>
                    <strong className="text-slate-800">{details.religion || "All Religions"}</strong>
                  </div>
                </div>

                {details.caption && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-xs">
                    <span className="text-slate-400 font-bold block mb-1">Advert Caption:</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{details.caption}</p>
                  </div>
                )}
              </div>

              {/* Proofs of Work Review Area */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Submitted Proofs of Work</h3>
                    <p className="text-xs text-slate-400">Review screenshots & usernames submitted by earners.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {proofs.length} Submission{proofs.length === 1 ? "" : "s"}
                  </span>
                </div>

                {proofLoading ? (
                  <div className="h-36 flex flex-col justify-center items-center gap-2">
                    <FaSpinner size={20} className="text-emerald-500 animate-spin" />
                    <span className="text-xs text-slate-400">Loading worker proofs...</span>
                  </div>
                ) : !proofs.length ? (
                  <div className="py-8 text-center">
                    <NoData textBelow="No worker proof submitted yet for this order." />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proofs.map((proof) => (
                      <ProofOfWork
                        proof={proof}
                        key={proof.id}
                        setChange={setDataChanged}
                        setError={setError}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (4 cols): Live Completion & Quick Help */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 sticky top-24">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Fulfillment Progress
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-emerald-600">
                      {Math.round(((details.completedTasks || 0) / (details.numberOfTasks || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((details.completedTasks || 0) / (details.numberOfTasks || 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-900">
                    Auto-Approval Policy:
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Proofs are queued for your verification. If not rejected within 24 hours, submissions automatically approve to reward legitimate workers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default OrderDetails;
