import React, { useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import axios from "axios";
import { IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FaSpinner, FaWhatsapp, FaShieldHalved } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import {
  FiHelpCircle,
  FiMessageSquare,
  FiSend,
  FiClock,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi";

const FAQS = [
  {
    q: "How fast do automated deposits reflect in my wallet?",
    a: "Automated deposits via PocketFi dedicated virtual accounts are credited automatically within 5 to 10 seconds. You receive instant wallet notification and SMS/email receipt.",
  },
  {
    q: "When and how can I withdraw my earnings?",
    a: "You can withdraw your earnings anytime directly to any verified Nigerian bank account (GTBank, OPay, PalmPay, Kuda, Zenith, Access, etc.) with fast automated payouts.",
  },
  {
    q: "How are task screenshots reviewed and approved?",
    a: "Once you submit your social task or status advert screenshot proof with your username, our automated and human verification desk validates the proof within hours.",
  },
  {
    q: "How do I earn the 60% instant referral bonus?",
    a: "Share your unique referral link found on your Profile or Invite page. When your referred user registers and activates their PRO membership, 60% of the membership fee is instantly credited to your wallet balance.",
  },
];

const HelpSupport = () => {
  const { adminData, currentUser } = useAuth();
  const [toastNotifications, setToastNotifications] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketModal, setTicketModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [category, setCategory] = useState("Deposit / Payment Issue");
  const [complaintText, setComplaintText] = useState("");

  const showToast = (notificationObj) => {
    setToastNotifications([...toastNotifications, notificationObj]);
    setTimeout(() => {
      setToastNotifications([]);
    }, 4000);
  };

  const handlePostTicket = async (e) => {
    e?.preventDefault();
    if (!complaintText.trim()) {
      return setFormError("Please provide details of your issue.");
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const payload = {
        complaint: `[${category}] ${complaintText.trim()}`,
        category,
        email: currentUser?.email,
        userId: currentUser?.id,
        username: currentUser?.username,
      };

      const res = await axios.post("/api/v1/complaint/post", payload);

      if (res.data?.failed) {
        setSubmitting(false);
        return setFormError(res.data.message || "Failed to submit ticket.");
      }

      setSubmitting(false);
      setComplaintText("");
      setTicketModal(false);
      showToast({
        msg: "✅ Support ticket submitted successfully! Our compliance desk is reviewing it.",
        errorType: "success",
      });
    } catch (err) {
      setSubmitting(false);
      setFormError(
        err.response?.data?.message || "An error occurred while submitting your ticket. Please try WhatsApp support."
      );
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-5 pb-8 max-w-5xl mx-auto">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-850 rounded-3xl p-5 sm:p-7 text-white shadow-sm border border-emerald-600/40 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                Help & Support Center
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              How can we help you today?
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-normal leading-relaxed max-w-xl">
              Have questions about your wallet, tasks, or account? Our support team is online 24/7 to assist you.
            </p>
          </div>
        </div>

        {/* 2 Primary Contact Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Channel 1: WhatsApp */}
          <a
            href="https://wa.link/l2u70b"
            target="_blank"
            rel="noreferrer"
            className="bg-white hover:bg-emerald-50/40 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs transition-all flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
                <FaWhatsapp size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    WhatsApp Live Desk
                  </h3>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Fastest response • Available 24/7
                </p>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold shrink-0 flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span>Chat</span>
              <FiExternalLink size={11} />
            </span>
          </a>

          {/* Channel 2: Submit Support Ticket */}
          <div
            onClick={() => setTicketModal(true)}
            className="bg-white hover:bg-emerald-50/40 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs transition-all flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <FiMessageSquare size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                  Submit Support Ticket
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Account, task, or payment dispute
                </p>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              Open Form
            </span>
          </div>
        </div>

        {/* 2-Column Section: FAQs & Service Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left: FAQs (7 cols) */}
          <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FiHelpCircle className="text-emerald-600 shrink-0" size={16} />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2 pt-1">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/70 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100/80 transition-colors cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <IoChevronUp size={16} className="text-emerald-600 shrink-0" />
                      ) : (
                        <IoChevronDown size={16} className="text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Guarantee & Security Reminder (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            {/* 24/7 Response Time Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <FiClock size={15} />
                <span>Quick Resolution Commitment</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                All submitted tickets and WhatsApp inquiries are answered by real support officers. Typical response time is under 15 minutes.
              </p>
            </div>

            {/* Compact Security Advisory */}
            <div className="bg-rose-50/70 border border-rose-200/70 rounded-3xl p-4 sm:p-5 text-rose-950 space-y-1.5">
              <div className="flex items-center gap-2">
                <FaShieldHalved className="text-rose-600 shrink-0" size={14} />
                <h4 className="font-bold text-xs text-rose-900 uppercase tracking-wide">
                  Official Security Advisory
                </h4>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Please disregard any unauthorized Telegram or WhatsApp deposit groups. {adminData?.appName || "DocsZar"} will never ask for your password or ask you to pay into personal bank accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Modal */}
        {ticketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl animate-scaleIn space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FiMessageSquare size={16} />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">
                    Lodge a Support Complaint
                  </h3>
                </div>
                <button
                  disabled={submitting}
                  onClick={() => setTicketModal(false)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  {formError}
                </div>
              )}

              <form onSubmit={handlePostTicket} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Deposit / Payment Issue">Deposit / Payment Issue</option>
                    <option value="Task Proof Verification">Task Proof Verification</option>
                    <option value="Bank Withdrawal Question">Bank Withdrawal Question</option>
                    <option value="PRO Membership Activation">PRO Membership Activation</option>
                    <option value="Account Settings / Profile">Account Settings / Profile</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe your issue
                  </label>
                  <textarea
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    placeholder="Provide details of what happened (dates, reference ID, or task name)..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition-all resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setTicketModal(false)}
                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !complaintText.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" size={13} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FiSend size={13} />
                        <span>Submit Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast notifications */}
        <div className="toast_cover">
          {toastNotifications?.map((toast, idx) => (
            <ToastNotification key={idx} toastNotification={toast} />
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default HelpSupport;

