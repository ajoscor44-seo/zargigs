import React, { useEffect, useState } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import axios from "axios";
import { FaAngleRight, FaSpinner, FaBullhorn, FaBolt, FaLayerGroup, FaCheck, FaClock } from "react-icons/fa6";
import { FiSearch, FiLayers, FiFilter, FiCheckCircle, FiClock, FiPlus } from "react-icons/fi";
import formatDate from "../hooks/formatDate";
import numeral from "numeral";
import { Link } from "react-router-dom/cjs/react-router-dom";
import NoData from "../components/NoData/NoData";
import ItemIcon from "../components/ItemIcon/ItemIcon";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../config/supabase.config";

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const userRecordId = currentUser?.id || currentUser?._id;

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const combined = [];

      // 1. Fetch Marketplace Tasks (Microtasks created by this user)
      try {
        let mktQuery = supabase
          .from("marketplace_tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (userRecordId) {
          mktQuery = mktQuery.eq("creator_id", userRecordId);
        }

        const { data: mktData } = await mktQuery;
        if (mktData && mktData.length > 0) {
          const mktIds = mktData.map((t) => t.id);
          const { data: subData } = await supabase
            .from("task_submissions")
            .select("id, task_id, status")
            .in("task_id", mktIds);

          const pendingMap = new Map();
          const approvedMap = new Map();
          (subData || []).forEach((s) => {
            if (s.status === "pending") {
              pendingMap.set(s.task_id, (pendingMap.get(s.task_id) || 0) + 1);
            } else if (s.status === "approved" || s.status === "auto_approved") {
              approvedMap.set(s.task_id, (approvedMap.get(s.task_id) || 0) + 1);
            }
          });

          combined.push(
            ...mktData.map((t) => ({
              id: t.id,
              _id: t.id,
              title: t.title,
              category: t.category || "microtask",
              orderType: "microtask",
              taskType: "microtask",
              slug: "microtasks",
              platform: t.guidelines?.app_name || t.category || "web",
              taskPlatform: t.guidelines?.app_name || t.category || "web",
              numberOfTasks: Number(t.total_slots || 10),
              completedTasks: approvedMap.get(t.id) || Number(t.slots_completed || 0),
              allocatedTasks: Number(t.slots_reserved || 0),
              pendingApprovals: pendingMap.get(t.id) || 0,
              amountPaid: Number(t.total_escrow_budget || (t.total_slots * (t.reward_per_worker || 100))),
              costPerTask: Number(t.reward_per_worker || 100),
              status: t.status || "active",
              createdAt: t.created_at,
              created_at: t.created_at,
            }))
          );
        }
      } catch (mktErr) {
        console.warn("Marketplace tasks lookup notice:", mktErr);
      }

      // 2. Fetch User Orders from API / Adverts & Engagements
      try {
        const [advRes, engRes] = await Promise.allSettled([
          axios.get("/api/v1/tasks/adverts?limit=50"),
          axios.get("/api/v1/tasks/engagements?limit=50"),
        ]);
        const advList = advRes.status === "fulfilled" ? (advRes.value.data?.data || advRes.value.data || []) : [];
        const engList = engRes.status === "fulfilled" ? (engRes.value.data?.data || engRes.value.data || []) : [];

        combined.push(
          ...advList.map((t) => ({ ...t, orderType: "advert", slug: "adverts" })),
          ...engList.map((t) => ({ ...t, orderType: "engagement", slug: "engagements" }))
        );
      } catch (apiErr) {
        console.warn("API orders lookup notice:", apiErr);
      }

      // 3. Direct Supabase query for advert_tasks and engagement_tasks if needed
      if (userRecordId && combined.filter((o) => o.orderType !== "microtask").length === 0) {
        try {
          const [advSnap, engSnap] = await Promise.allSettled([
            supabase.from("advert_tasks").select("*").eq("user_id", userRecordId).order("created_at", { ascending: false }),
            supabase.from("engagement_tasks").select("*").eq("user_id", userRecordId).order("created_at", { ascending: false }),
          ]);
          if (advSnap.status === "fulfilled" && advSnap.value.data) {
            combined.push(...advSnap.value.data.map((t) => ({ ...t, orderType: "advert", slug: "adverts" })));
          }
          if (engSnap.status === "fulfilled" && engSnap.value.data) {
            combined.push(...engSnap.value.data.map((t) => ({ ...t, orderType: "engagement", slug: "engagements" })));
          }
        } catch {}
      }

      // Deduplicate by ID and sort descending
      const uniqueMap = new Map();
      combined.forEach((item) => {
        if (item.id && !uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });

      const sorted = Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
      );

      setOrders(sorted);
    } catch (err) {
      console.error("fetchAllOrders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [userRecordId]);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesType =
      filterType === "all"
        ? true
        : filterType === "microtasks"
        ? order.orderType === "microtask"
        : filterType === "adverts"
        ? order.orderType === "advert" || order.taskType === "advert" || order.slug === "adverts"
        : order.orderType === "engagement" || order.taskType === "engagement" || order.slug === "engagements";

    const matchesSearch =
      !searchTerm ||
      (order.title && order.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.platform && order.platform.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.taskPlatform && order.taskPlatform.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const microtasksCount = orders.filter((o) => o.orderType === "microtask").length;
  const advertsCount = orders.filter(
    (o) => o.orderType === "advert" || o.taskType === "advert" || o.slug === "adverts"
  ).length;
  const engagementsCount = orders.filter(
    (o) => o.orderType === "engagement" || o.taskType === "engagement" || o.slug === "engagements"
  ).length;

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Page Header */}
        <div className="pb-2 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>My Campaigns & Orders</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-black">
                {orders.length} Total
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Live progress analytics and submissions verification for all your placed adverts, microtasks & engagements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/create-task"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <FiPlus size={15} />
              <span>Post Microtask</span>
            </Link>
            <Link
              to="/order"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FiPlus size={15} />
              <span>New Advert Order</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Unified Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <FiLayers size={13} />
              <span>All Orders</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filterType === "all" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                }`}
              >
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType("microtasks")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === "microtasks"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <FaLayerGroup size={12} />
              <span>Microtasks</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filterType === "microtasks" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                }`}
              >
                {microtasksCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType("adverts")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === "adverts"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <span>📢 Adverts</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filterType === "adverts" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                }`}
              >
                {advertsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType("engagements")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === "engagements"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <span>⚡ Engagements</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filterType === "engagements" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                }`}
              >
                {engagementsCount}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center gap-3 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
            <FaSpinner size={28} className="text-emerald-500 animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading all your campaigns...</p>
          </div>
        ) : !filteredOrders.length ? (
          <div className="min-h-[300px] flex flex-col justify-center items-center bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-3 shadow-2xs">
            <NoData textBelow={searchTerm ? "No campaigns match your search query." : "No campaigns created yet."} />
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/create-task"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <FiPlus size={14} />
                <span>Post Microtask Campaign</span>
              </Link>
              <Link
                to="/order"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <FiPlus size={14} />
                <span>Create Advert Order</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((data) => {
              const isMicrotask = data.orderType === "microtask";
              const taskType = isMicrotask
                ? "microtask"
                : data.orderType === "advert" || data.taskType === "advert" || data.slug === "adverts"
                ? "advert"
                : "engagement";

              const targetLink = isMicrotask
                ? `/creator/campaigns/${data.id}`
                : `/order-history/${taskType === "advert" ? "adverts" : "engagements"}/${data.id}`;

              const targetPlatform = data.taskPlatform || data.platform || (isMicrotask ? "web" : "whatsapp");

              const totalTasks = Number(data.numberOfTasks || data.number_of_tasks || data.total_slots || 0);
              const doneTasks = Number(data.completedTasks || data.tasksDone || data.tasks_done || data.slots_completed || 0);
              const progressPct = totalTasks > 0 ? Math.min(100, Math.round((doneTasks / totalTasks) * 100)) : 0;

              const isCompleted = (totalTasks > 0 && doneTasks >= totalTasks) || data.status === "completed";
              const orderStatus = isCompleted ? "Completed" : doneTasks > 0 ? "In Progress" : "Active";

              const statusColor =
                orderStatus === "Completed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                  : orderStatus === "In Progress"
                  ? "bg-sky-50 text-sky-700 border-sky-200/60"
                  : "bg-amber-50 text-amber-700 border-amber-200/60";

              const totalSpend =
                Number(data.amountPaid || data.amount_paid) > 0
                  ? Number(data.amountPaid || data.amount_paid)
                  : totalTasks * (taskType === "advert" ? 150 : taskType === "microtask" ? (data.costPerTask || 100) : 35);

              return (
                <Link
                  to={targetLink}
                  key={data.id}
                  className="block text-decoration-none group"
                >
                  <div className="bg-white border border-slate-200/80 hover:border-emerald-400/80 rounded-3xl p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/5 flex flex-col justify-between gap-4 h-full shadow-2xs">
                    {/* Top Row: Icon, Title & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                          {isMicrotask ? (
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                              <FaLayerGroup size={16} />
                            </div>
                          ) : (
                            <ItemIcon
                              platform={targetPlatform}
                              size={28}
                              playstoreSize="w-7 h-7"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                isMicrotask
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : taskType === "advert"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                  : "bg-blue-50 text-blue-700 border border-blue-200/60"
                              }`}
                            >
                              {isMicrotask
                                ? `🎯 ${data.category || "Microtask"}`
                                : taskType === "advert"
                                ? "📢 Advert"
                                : "⚡ Engagement"}
                            </span>

                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}
                            >
                              {orderStatus}
                            </span>

                            {data.pendingApprovals > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white animate-pulse">
                                <span>{data.pendingApprovals} to Review</span>
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm sm:text-base capitalize group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {data.title || `${targetPlatform} ${taskType === "advert" ? "Status Advert" : "Engagement"}`}
                          </h3>
                        </div>
                      </div>

                      <div className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all p-1">
                        <FaAngleRight size={16} />
                      </div>
                    </div>

                    {/* Middle Progress Meter */}
                    <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">
                          Completed / Quota:{" "}
                          <strong className="text-slate-900">
                            {numeral(doneTasks).format()} / {numeral(totalTasks).format()}
                          </strong>
                        </span>
                        <span className="text-emerald-600 font-extrabold">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom Action / Review Callout */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>Budget / Paid:</span>
                        <span className="text-emerald-600 font-extrabold text-sm">
                          ₦{numeral(totalSpend).format("0,0.00")}
                        </span>
                      </div>

                      {data.pendingApprovals > 0 ? (
                        <span className="px-3 py-1 bg-amber-500 text-white font-extrabold text-[11px] rounded-lg shadow-xs flex items-center gap-1">
                          <span>Review & Approve ({data.pendingApprovals})</span>
                          <FaAngleRight size={10} />
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs group-hover:underline flex items-center gap-1">
                          <span>Manage Campaign</span>
                          <FaAngleRight size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default OrderHistory;
