import React, { useState, useEffect } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import Notification from "../components/Notification/Notification";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
import { FiBell } from "react-icons/fi";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [change, setChange] = useState(new Date().getTime());
  const [meta, setMeta] = useState({});
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/v1/notifications?limit=${limit}`);
      const data = response.data;
      setNotifications(data.data || []);
      setMeta(data.meta || {});
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const markAsRead = async (id, read) => {
    if (read) return;
    try {
      const response = await axios.put(`/api/v1/notifications?id=${id}`);
      if (response.data.success) {
        setChange(new Date().getTime());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchNotifications();
  }, [limit, change]);

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        <div className="pb-2 border-b border-slate-200/70">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Real-time activity alerts, task approval reviews, and wallet payment notices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Notifications Stream */}
          <div className="md:col-span-8 space-y-4">
            {loading ? (
              <div className="py-24 flex justify-center items-center bg-white rounded-3xl border border-slate-200/80">
                <FaSpinner className="animate-spin text-emerald-600" size={30} />
              </div>
            ) : notifications.length ? (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
                  {notifications.map((notification, i) => (
                    <Notification
                      key={notification._id || notification.id || i}
                      markAsRead={markAsRead}
                      notification={notification}
                    />
                  ))}
                </div>

                {meta.total > limit && (
                  <div className="pt-2 text-center">
                    <button
                      className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                      onClick={() => setLimit((prev) => prev + 10)}
                    >
                      Load older notifications...
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 shadow-xs border border-slate-200/80 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <FiBell size={28} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">
                  No Notifications Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                  You're all caught up! New task assignments, payment updates, and alerts will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Quick Stats & Tips */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Alert Preferences
              </h3>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2 text-xs">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>🔔</span>
                  <span>Instant Status Updates</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  You receive instant alerts when your task submissions are reviewed and when withdrawal payments are dispatched.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs text-slate-600">
                <h4 className="font-black text-slate-900">
                  Notification Types:
                </h4>
                <ul className="text-[11px] leading-relaxed text-slate-500 space-y-1.5 list-disc pl-4">
                  <li>✅ Task approvals and reward credits</li>
                  <li>💳 Bank payout disbursements</li>
                  <li>👥 Referral bonuses & milestone earnings</li>
                  <li>📢 Platform updates & announcements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Notifications;

