import React, { useState, useEffect, useCallback } from "react";
import ClientLayout from "../components/ClientLayout/ClientLayout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import numeral from "numeral";
import formatDate from "../hooks/formatDate";
import { supabase } from "../config/supabase.config";
import { bankService } from "../services/supabaseService";
import {
  FiUsers,
  FiCreditCard,
  FiShield,
  FiSettings,
  FiBell,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiTrendingUp,
  FiDollarSign,
  FiAlertCircle,
  FiUserCheck,
  FiLock,
  FiUnlock,
  FiEdit,
  FiEye,
  FiTrash2,
  FiCheckSquare,
  FiArrowUpRight,
  FiExternalLink,
  FiTag,
  FiSliders,
  FiPercent,
  FiActivity,
  FiClock,
} from "react-icons/fi";
import { FaCrown, FaSpinner, FaBuilding, FaBullhorn, FaListCheck, FaWallet, FaCopy, FaCheck } from "react-icons/fa6";

const FALLBACK_BANKS = [
  { name: "Opay Digital Services Limited", code: "100004" },
  { name: "PALMPAY", code: "100033" },
  { name: "Moniepoint Microfinance Bank", code: "090405" },
  { name: "Kuda Bank", code: "090267" },
  { name: "Access Bank", code: "000014" },
  { name: "Guaranty Trust Bank (GTB)", code: "000013" },
  { name: "First Bank of Nigeria", code: "000016" },
  { name: "United Bank For Africa (UBA)", code: "000004" },
  { name: "Zenith Bank", code: "000015" },
  { name: "Fidelity Bank", code: "000007" },
  { name: "Wema Bank", code: "000017" },
  { name: "Sterling Bank", code: "000001" },
  { name: "Stanbic IBTC Bank", code: "000012" },
  { name: "Union Bank Of Nigeria", code: "000018" },
  { name: "First City Monument Bank (FCMB)", code: "000003" },
  { name: "Polaris Bank", code: "000008" },
  { name: "Ecobank Nigeria", code: "000010" },
  { name: "VFD Microfinance Bank", code: "090110" },
  { name: "Providus Bank", code: "000023" },
  { name: "Jaiz Bank", code: "000006" },
  { name: "Taj Bank", code: "000026" },
  { name: "9 Payment Service Bank (9PSB)", code: "120001" },
];

// --- SKELETON LOADER COMPONENTS ---

const StatCardSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-slate-200 rounded-md"></div>
          <div className="w-9 h-9 rounded-xl bg-slate-100"></div>
        </div>
        <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
        <div className="h-2.5 w-36 bg-slate-100 rounded-md"></div>
      </div>
    ))}
  </div>
);

const TableSkeleton = ({ rows = 5, cols = 7 }) => (
  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
      <div className="space-y-1.5">
        <div className="h-4 w-44 bg-slate-200 rounded-md"></div>
        <div className="h-2.5 w-64 bg-slate-100 rounded-md"></div>
      </div>
      <div className="h-9 w-48 bg-slate-100 rounded-xl"></div>
    </div>
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
      <div className="h-10 bg-slate-50 border-b border-slate-200/80 flex items-center px-4 gap-4">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="h-3 bg-slate-200 rounded-md flex-1"></div>
        ))}
      </div>
      <div className="divide-y divide-slate-100 p-2 space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 py-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0"></div>
            <div className="h-3.5 bg-slate-100 rounded-md flex-1"></div>
            <div className="h-3.5 bg-slate-100 rounded-md flex-1 hidden sm:block"></div>
            <div className="h-3.5 bg-slate-100 rounded-md flex-1"></div>
            <div className="h-6 w-16 bg-slate-200 rounded-full shrink-0"></div>
            <div className="h-8 w-20 bg-slate-200 rounded-xl shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TaskGridSkeleton = () => (
  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
      <div className="space-y-1.5">
        <div className="h-4 w-52 bg-slate-200 rounded-md"></div>
        <div className="h-2.5 w-72 bg-slate-100 rounded-md"></div>
      </div>
      <div className="h-9 w-60 bg-slate-100 rounded-xl"></div>
    </div>
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
      <div className="h-10 bg-slate-50 border-b border-slate-200/80 flex items-center px-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((c) => (
          <div key={c} className="h-3 bg-slate-200 rounded-md flex-1"></div>
        ))}
      </div>
      <div className="divide-y divide-slate-100 p-2 space-y-3">
        {[1, 2, 3, 4, 5].map((r) => (
          <div key={r} className="flex items-center gap-4 py-3 px-2">
            <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/6"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/6"></div>
            <div className="h-3 bg-slate-200 rounded-md w-1/12 font-mono"></div>
            <div className="h-6 w-20 bg-amber-100 rounded-full"></div>
            <div className="h-8 w-24 bg-slate-200 rounded-xl ml-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PricingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="h-4 w-48 bg-slate-200 rounded-md mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-6 w-24 bg-slate-300 rounded-lg"></div>
            <div className="h-3 w-full bg-slate-200 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date());
  const [tabLoading, setTabLoading] = useState({
    overview: false,
    users: false,
    withdrawals: false,
    tasks: false,
    submissions: false,
    fundings: false,
    pricing: false,
    settings: false,
    announcements: false,
    complaints: false,
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Overview Stats
  const [totals, setTotals] = useState({
    totalUsers: 0,
    totalMembers: 0,
    totalBanned: 0,
    totalBalance: 0,
  });

  // Withdrawals Queue
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});

  // Users Management & Edit Modal
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userEditForm, setUserEditForm] = useState({});
  const [savingUser, setSavingUser] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [availableBanks, setAvailableBanks] = useState(FALLBACK_BANKS);
  const [copiedText, setCopiedText] = useState("");

  // Platform Tasks & Campaigns
  const [tasksList, setTasksList] = useState([]);
  const [taskFilter, setTaskFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [taskEditForm, setTaskEditForm] = useState({});

  // Submissions & Proof of Work
  const [submissions, setSubmissions] = useState([]);
  const [submissionFilter, setSubmissionFilter] = useState("all");

  // Fundings & Manual Deposits
  const [fundings, setFundings] = useState([]);
  const [fundingFilter, setFundingFilter] = useState("all");

  // Pricing & Platform Rates
  const [pricingConfig, setPricingConfig] = useState({
    createAdvert: [],
    createEngagement: [],
    earnAdvert: [],
    earnEngagement: [],
  });
  const [editingPriceItem, setEditingPriceItem] = useState(null);

  // Platform Settings
  const [adminSettings, setAdminSettings] = useState({
    appName: "DocsZar",
    membershipFee: 1000,
    withdrawalCharges: 50,
    minWithdrawal: 1000,
    referralBonus: 600,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    type: "info",
  });

  // Complaints
  const [complaints, setComplaints] = useState([]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
  };

  // --- FETCH FUNCTIONS WITH RESILIENT BACKEND & SUPABASE FALLBACKS ---

  const fetchAdminOverview = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, overview: true }));
    try {
      const res = await axios.get("/api/v1/admin/users/totals", {
        headers: { "x-user-id": currentUser?.id || currentUser?.uid },
      });
      if (res.data) {
        setTotals({
          totalUsers: res.data.meta?.total ?? res.data.totalUsers ?? 0,
          totalMembers: res.data.meta?.members ?? res.data.totalMembers ?? 0,
          totalBanned: res.data.meta?.banned ?? res.data.totalBanned ?? 0,
          totalBalance: res.data.meta?.balance ?? res.data.totalBalance ?? 0,
        });
      }
    } catch (err) {
      console.warn("fetchAdminOverview backend fallback to Supabase:", err.message);
      try {
        const { data: users, count } = await supabase
          .from("users")
          .select("id, is_member, is_banned, balance", { count: "exact" });
        if (users) {
          const members = users.filter((u) => u.is_member).length;
          const banned = users.filter((u) => u.is_banned).length;
          const balance = users.reduce((acc, u) => acc + (Number(u.balance) || 0), 0);
          setTotals({
            totalUsers: count || users.length,
            totalMembers: members,
            totalBanned: banned,
            totalBalance: balance,
          });
        }
      } catch (dbErr) {
        console.error("fetchAdminOverview supabase error:", dbErr);
      }
    } finally {
      setTabLoading((prev) => ({ ...prev, overview: false }));
    }
  }, [currentUser]);

  const fetchWithdrawals = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, withdrawals: true }));
    try {
      const res = await axios.get("/api/v1/admin/withdrawal-request?limit=100", {
        headers: { "x-user-id": currentUser?.id || currentUser?.uid },
      });
      setWithdrawals(res.data?.data || []);
    } catch (err) {
      console.warn("fetchWithdrawals backend fallback to Supabase:", err.message);
      try {
        const { data } = await supabase
          .from("withdrawal_requests")
          .select("*, users:user_id(firstname, lastname, username, email, phone)")
          .order("created_at", { ascending: false })
          .limit(100);
        if (data) setWithdrawals(data);
      } catch (dbErr) {
        console.error("fetchWithdrawals supabase error:", dbErr);
      }
    } finally {
      setTabLoading((prev) => ({ ...prev, withdrawals: false }));
    }
  }, [currentUser]);

  const fetchUsers = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, users: true }));
    try {
      const res = await axios.get("/api/v1/admin/users?limit=100", {
        headers: { "x-user-id": currentUser?.id || currentUser?.uid },
      });
      const data = res.data?.data || res.data?.users || [];
      setUsersList(data);
    } catch (err) {
      console.warn("fetchUsers backend fallback to Supabase:", err.message);
      try {
        const { data: users } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (users) {
          const userIds = users.map((u) => u.id);
          const { data: details } = await supabase
            .from("user_details")
            .select("*")
            .in("user_id", userIds);

          const detailsMap = new Map();
          (details || []).forEach((d) => detailsMap.set(d.user_id, d));

          const merged = users.map((u) => {
            const d = detailsMap.get(u.id) || {};
            return {
              ...u,
              gender: d.gender || "",
              device: d.device || "",
              device_type: d.device || "",
              state: d.state || "",
              lga: d.lga || "",
              bank_name: d.bank_name || u.bank_name || "",
              account_number: d.account_number || u.account_number || "",
              account_name: d.account_name || u.account_name || "",
              bankDetails: {
                bankName: d.bank_name || u.bank_name || "",
                accountNumber: d.account_number || u.account_number || "",
                accountName: d.account_name || u.account_name || "",
              },
              virtual_account_bank: d.virtual_account_bank || "",
              virtual_account_number: d.virtual_account_number || "",
              virtual_account_name: d.virtual_account_name || "",
            };
          });
          setUsersList(merged);
        }
      } catch (dbErr) {
        console.error("fetchUsers supabase error:", dbErr);
      }
    } finally {
      setTabLoading((prev) => ({ ...prev, users: false }));
    }
  }, [currentUser]);

  const fetchTasks = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, tasks: true }));
    try {
      const res = await axios.get("/api/v1/admin/tasks", {
        headers: { "x-user-id": currentUser?.id || currentUser?.uid },
      });
      setTasksList(res.data?.tasks || res.data?.data || []);
    } catch (err) {
      console.warn("fetchTasks backend fallback to Supabase:", err.message);
      try {
        const [mkt, adv, eng] = await Promise.allSettled([
          supabase.from("marketplace_tasks").select("*, users:creator_id(username, email)").order("created_at", { ascending: false }).limit(100),
          supabase.from("advert_tasks").select("*, users:user_id(username, email)").order("created_at", { ascending: false }).limit(100),
          supabase.from("engagement_tasks").select("*, users:user_id(username, email)").order("created_at", { ascending: false }).limit(100),
        ]);
        const list = [
          ...(mkt.status === "fulfilled" && mkt.value?.data ? mkt.value.data.map(t => ({ ...t, sourceTable: "marketplace_tasks", typeName: `Microtask (${t.category || "General"})` })) : []),
          ...(adv.status === "fulfilled" && adv.value?.data ? adv.value.data.map(t => ({ ...t, sourceTable: "advert_tasks", typeName: "Social Advert" })) : []),
          ...(eng.status === "fulfilled" && eng.value?.data ? eng.value.data.map(t => ({ ...t, sourceTable: "engagement_tasks", typeName: "Engagement Task" })) : []),
        ];
        setTasksList(list);
      } catch (dbErr) {
        console.error("fetchTasks supabase error:", dbErr);
      }
    } finally {
      setTabLoading((prev) => ({ ...prev, tasks: false }));
    }
  }, [currentUser]);

  const fetchSubmissions = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, submissions: true }));
    try {
      const res = await axios.get("/api/v1/admin/submissions", {
        headers: { "x-user-id": currentUser?.id || currentUser?.uid },
      });
      setSubmissions(res.data?.submissions || res.data?.data || []);
    } catch (err) {
      console.warn("fetchSubmissions backend fallback to Supabase:", err.message);
      try {
        const { data } = await supabase
          .from("task_submissions")
          .select("*, users:worker_id(username, email), marketplace_tasks:task_id(title, category)")
          .order("created_at", { ascending: false })
          .limit(100);
        if (data) setSubmissions(data);
      } catch (dbErr) {
        console.error("fetchSubmissions supabase error:", dbErr);
      }
    } finally {
      setTabLoading((prev) => ({ ...prev, submissions: false }));
    }
  }, [currentUser]);

  const fetchFundings = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, fundings: true }));
    try {
      const res = await axios.get("/api/v1/admin/fundings", {
        headers: { "x-user-id": currentUser?.id || currentUser?.uid },
      });
      setFundings(res.data?.fundings || res.data?.data || []);
    } catch (err) {
      console.warn("fetchFundings backend fallback to Supabase:", err.message);
      try {
        const { data } = await supabase
          .from("funding")
          .select("*, users:user_id(username, email)")
          .order("created_at", { ascending: false })
          .limit(100);
        if (data) setFundings(data);
      } catch (dbErr) {
        console.error("fetchFundings supabase error:", dbErr);
      }
    } finally {
      setTabLoading((prev) => ({ ...prev, fundings: false }));
    }
  }, [currentUser]);

  const fetchPricing = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, pricing: true }));
    try {
      const res = await axios.get("/api/v1/admin/pricing");
      if (res.data) {
        setPricingConfig({
          createAdvert: res.data.createAdvert || [],
          createEngagement: res.data.createEngagement || [],
          earnAdvert: res.data.earnAdvert || [],
          earnEngagement: res.data.earnEngagement || [],
        });
      }
    } catch (err) {
      console.warn("fetchPricing backend fallback to Supabase:", err.message);
      try {
        const [cAdv, cEng, eAdv, eEng] = await Promise.all([
          supabase.from("create_advert_config").select("*"),
          supabase.from("create_engagement_config").select("*"),
          supabase.from("earn_advert_config").select("*"),
          supabase.from("earn_engagement_config").select("*"),
        ]);
        setPricingConfig({
          createAdvert: cAdv.data || [],
          createEngagement: cEng.data || [],
          earnAdvert: eAdv.data || [],
          earnEngagement: eEng.data || [],
        });
      } catch (dbErr) {
        console.error("fetchPricing supabase error:", dbErr);
      }
    } finally {
      setTabLoading((prev) => ({ ...prev, pricing: false }));
    }
  }, []);

  const fetchAdminSettings = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, settings: true }));
    try {
      const res = await axios.get("/api/v1/admin-data");
      const s = res.data?.[0] || res.data || {};
      setAdminSettings({
        appName: s.appName || s.app_name || "DocsZar",
        membershipFee: s.membershipFee || s.membership_fee || 1000,
        withdrawalCharges: s.withdrawalCharges || s.min_withdrawal || 50,
        minWithdrawal: s.minWithdrawal || s.min_withdrawal || 1000,
        referralBonus: s.referralBonus || s.referral_bonus || 600,
      });
    } catch (err) {
      console.warn("fetchAdminSettings error:", err.message);
    } finally {
      setTabLoading((prev) => ({ ...prev, settings: false }));
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, announcements: true }));
    try {
      const res = await axios.get("/api/v1/announcement");
      setAnnouncements(res.data?.announcements || res.data?.data || []);
    } catch (err) {
      console.warn("fetchAnnouncements error:", err.message);
    } finally {
      setTabLoading((prev) => ({ ...prev, announcements: false }));
    }
  }, []);

  const fetchComplaints = useCallback(async () => {
    setTabLoading((prev) => ({ ...prev, complaints: true }));
    try {
      const res = await axios.get("/api/v1/admin/complaints");
      setComplaints(res.data?.data || []);
    } catch (err) {
      console.warn("fetchComplaints error:", err.message);
    } finally {
      setTabLoading((prev) => ({ ...prev, complaints: false }));
    }
  }, []);

  // Sync entire dashboard
  const syncAllData = useCallback(async (isManual = false) => {
    setIsSyncing(true);
    await Promise.allSettled([
      fetchAdminOverview(),
      fetchWithdrawals(),
      fetchUsers(),
      fetchTasks(),
      fetchSubmissions(),
      fetchFundings(),
      fetchPricing(),
      fetchAdminSettings(),
      fetchAnnouncements(),
      fetchComplaints(),
    ]);
    setLastSynced(new Date());
    setIsSyncing(false);
    if (isManual) {
      showFeedback("success", "Admin dashboard fully synchronized with live database!");
    }
  }, [
    fetchAdminOverview,
    fetchWithdrawals,
    fetchUsers,
    fetchTasks,
    fetchSubmissions,
    fetchFundings,
    fetchPricing,
    fetchAdminSettings,
    fetchAnnouncements,
    fetchComplaints,
  ]);

  // Initial load
  useEffect(() => {
    syncAllData(false);
  }, [syncAllData]);

  // Tab-specific live sync on tab switch
  useEffect(() => {
    switch (activeTab) {
      case "overview":
        fetchAdminOverview();
        fetchWithdrawals();
        fetchTasks();
        break;
      case "users":
        fetchUsers();
        break;
      case "withdrawals":
        fetchWithdrawals();
        break;
      case "fundings":
        fetchFundings();
        break;
      case "tasks":
        fetchTasks();
        break;
      case "submissions":
        fetchSubmissions();
        break;
      case "pricing":
        fetchPricing();
        break;
      case "settings":
        fetchAdminSettings();
        break;
      case "announcements":
        fetchAnnouncements();
        break;
      case "complaints":
        fetchComplaints();
        break;
      default:
        break;
    }
  }, [
    activeTab,
    fetchAdminOverview,
    fetchWithdrawals,
    fetchUsers,
    fetchTasks,
    fetchSubmissions,
    fetchFundings,
    fetchPricing,
    fetchAdminSettings,
    fetchAnnouncements,
    fetchComplaints,
  ]);

  // --- ACTIONS ---

  // Fetch public banks on mount (674+ Nigerian banks from PocketFi)
  useEffect(() => {
    const fetchPublicBanks = async () => {
      try {
        const banks = await bankService.getBanks();
        if (banks && banks.length > 0) {
          setAvailableBanks(banks);
        }
      } catch (err) {
        console.warn("Public banks fetch error:", err.message);
      }
    };
    fetchPublicBanks();
  }, []);

  // Bank Account Verification via PocketFi
  const handleVerifyBankDetails = async () => {
    const acc = String(userEditForm.accountNumber || "").trim();
    const bName = String(userEditForm.bankName || "").trim();
    if (!acc || acc.length !== 10) {
      showFeedback("error", "Please enter a valid 10-digit Nigerian account number.");
      return;
    }
    if (!bName) {
      showFeedback("error", "Please enter or select a bank name first.");
      return;
    }
    try {
      setVerifyingBank(true);
      const selectedBank = availableBanks.find(
        (b) => b.name?.toLowerCase() === bName.toLowerCase()
      );
      const bankCode = selectedBank?.code || "";
      const res = await bankService.verifyAccount(acc, bankCode, bName);
      if (res?.status === "success" && res.accountName) {
        setUserEditForm((prev) => ({
          ...prev,
          accountName: res.accountName,
        }));
        showFeedback("success", `Account Verified: ${res.accountName}`);
      } else {
        showFeedback("error", "Could not verify bank account name.");
      }
    } catch (err) {
      showFeedback("error", err.message || "Account verification failed. You can enter the name manually.");
    } finally {
      setVerifyingBank(false);
    }
  };

  // User Actions
  const openUserEditor = async (user) => {
    const userId = user.id || user._id;
    setUserEditForm({
      id: userId,
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      balance: user.balance || 0,
      pendingBalance: user.pending_balance || user.pendingBalance || 0,
      role: user.role || "user",
      isMember: user.isMember || user.is_member || false,
      isBanned: user.isBanned || user.is_banned || false,
      isNINVerified: user.isNINVerified || user.is_nin_verified || false,
      isEmailVerified: user.isEmailVerified || user.is_email_verified || false,
      bankName: user.bankDetails?.bankName || user.bank_name || user.bankName || "",
      accountNumber: user.bankDetails?.accountNumber || user.account_number || user.accountNumber || "",
      accountName: user.bankDetails?.accountName || user.account_name || user.accountName || "",
      virtualAccountBank: user.virtual_account_bank || "",
      virtualAccountNumber: user.virtual_account_number || "",
      virtualAccountName: user.virtual_account_name || "",
    });
    setEditingUser(user);

    // Fetch fresh user_details from Supabase to guarantee payout bank info is populated
    try {
      const { data: details } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (details) {
        setUserEditForm((prev) => ({
          ...prev,
          bankName: details.bank_name || prev.bankName || "",
          accountNumber: details.account_number || prev.accountNumber || "",
          accountName: details.account_name || prev.accountName || "",
          virtualAccountBank: details.virtual_account_bank || prev.virtualAccountBank || "",
          virtualAccountNumber: details.virtual_account_number || prev.virtualAccountNumber || "",
          virtualAccountName: details.virtual_account_name || prev.virtualAccountName || "",
        }));
      }
    } catch (err) {
      console.warn("Could not fetch user_details on modal open:", err);
    }
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    try {
      setSavingUser(true);
      const adminId = currentUser?.id || currentUser?._id || currentUser?.uid;

      // 1. Try Backend API
      try {
        await axios.put(
          "/api/v1/admin/user/edit",
          {
            ...userEditForm,
            bankDetails: {
              bankName: userEditForm.bankName,
              accountNumber: userEditForm.accountNumber,
              accountName: userEditForm.accountName,
            },
          },
          { headers: { "x-user-id": adminId } }
        );
      } catch (apiErr) {
        console.warn("Backend API failed, updating Supabase directly:", apiErr);
      }

      // 2. Direct Supabase update for 100% guarantee
      await supabase
        .from("users")
        .update({
          firstname: userEditForm.firstname,
          lastname: userEditForm.lastname,
          username: userEditForm.username,
          email: userEditForm.email,
          phone: userEditForm.phone,
          balance: Number(userEditForm.balance) || 0,
          pending_balance: Number(userEditForm.pendingBalance) || 0,
          role: userEditForm.role,
          is_member: Boolean(userEditForm.isMember),
          is_banned: Boolean(userEditForm.isBanned),
        })
        .eq("id", userEditForm.id);

      const { data: existingDetails } = await supabase
        .from("user_details")
        .select("id")
        .eq("user_id", userEditForm.id)
        .maybeSingle();

      const bankPayload = {
        bank_name: userEditForm.bankName || "",
        account_number: userEditForm.accountNumber || "",
        account_name: userEditForm.accountName || "",
        virtual_account_bank: userEditForm.virtualAccountBank || null,
        virtual_account_number: userEditForm.virtualAccountNumber || null,
        virtual_account_name: userEditForm.virtualAccountName || null,
        updated_at: new Date().toISOString(),
      };

      if (existingDetails) {
        await supabase
          .from("user_details")
          .update(bankPayload)
          .eq("user_id", userEditForm.id);
      } else {
        await supabase
          .from("user_details")
          .insert({
            user_id: userEditForm.id,
            ...bankPayload,
          });
      }

      showFeedback("success", `User @${userEditForm.username} profile, wallet & payout details updated!`);
      setEditingUser(null);
      await fetchUsers();
      await fetchAdminOverview();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || err.message || "Failed to update user profile");
    } finally {
      setSavingUser(false);
    }
  };

  // Withdrawal Actions
  const handleApproveWithdrawal = async (item) => {
    try {
      setActionLoading((prev) => ({ ...prev, [item.id]: "approving" }));
      const adminId = currentUser?.id || currentUser?._id || currentUser?.uid;
      try {
        await axios.put(
          "/api/v1/admin/withdrawal-request",
          {
            id: item.id,
            userId: item.userId || item.user_id,
            amount: item.amount || item.withdrawalAmount,
          },
          { headers: { "x-user-id": adminId } }
        );
      } catch (apiErr) {
        console.warn("Backend API failed, updating Supabase directly:", apiErr);
        await supabase
          .from("withdrawal_requests")
          .update({ status: "approved" })
          .eq("id", item.id);
      }
      showFeedback("success", `Withdrawal for ₦${item.amount || item.withdrawalAmount} approved!`);
      await fetchWithdrawals();
      await fetchAdminOverview();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || err.message || "Failed to approve withdrawal");
    } finally {
      setActionLoading((prev) => ({ ...prev, [item.id]: null }));
    }
  };

  const handleDisapproveWithdrawal = async (item) => {
    const reason = window.prompt("Enter rejection reason (or leave blank):", "Bank details mismatch");
    if (reason === null) return;

    try {
      setActionLoading((prev) => ({ ...prev, [item.id]: "disapproving" }));
      const adminId = currentUser?.id || currentUser?._id || currentUser?.uid;
      const targetUserId = item.userId || item.user_id;
      const refundAmt = Number(item.amount || item.withdrawalAmount || 0);

      try {
        await axios.patch(
          "/api/v1/admin/withdrawal-request",
          {
            id: item.id,
            userId: targetUserId,
            amount: refundAmt,
            returnAmount: true,
            reason: reason ? `due to: ${reason}` : "",
          },
          { headers: { "x-user-id": adminId } }
        );
      } catch (apiErr) {
        console.warn("Backend API failed, updating Supabase directly:", apiErr);
        await supabase
          .from("withdrawal_requests")
          .update({ status: "disapproved" })
          .eq("id", item.id);

        if (targetUserId && refundAmt > 0) {
          const { data: u } = await supabase.from("users").select("balance").eq("id", targetUserId).maybeSingle();
          if (u) {
            await supabase.from("users").update({ balance: (Number(u.balance) || 0) + refundAmt }).eq("id", targetUserId);
          }
        }
      }
      showFeedback("success", `Withdrawal rejected and funds refunded to user.`);
      await fetchWithdrawals();
      await fetchAdminOverview();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || err.message || "Failed to reject withdrawal");
    } finally {
      setActionLoading((prev) => ({ ...prev, [item.id]: null }));
    }
  };

  // Task Actions & Moderation
  const handleApproveTask = async (task) => {
    try {
      setActionLoading((prev) => ({ ...prev, [task.id]: "approving" }));
      await axios.put(
        "/api/v1/admin/task",
        {
          id: task.id,
          sourceTable: task.sourceTable || "marketplace_tasks",
          status: "active",
          moderationStatus: "approved",
        },
        { headers: { "x-user-id": currentUser?.id } }
      );
      showFeedback("success", `Campaign "${task.title}" approved and published live to marketplace!`);
      await fetchTasks();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to approve task");
    } finally {
      setActionLoading((prev) => ({ ...prev, [task.id]: null }));
    }
  };

  const handleDisapproveTask = async (task) => {
    const reason = window.prompt("Enter rejection reason for creator (escrow will be refunded to their wallet):", "Task does not follow community guidelines");
    if (reason === null) return;

    try {
      setActionLoading((prev) => ({ ...prev, [task.id]: "rejecting" }));
      await axios.put(
        "/api/v1/admin/task",
        {
          id: task.id,
          sourceTable: task.sourceTable || "marketplace_tasks",
          status: "rejected",
          moderationStatus: "rejected",
          moderationNotes: reason,
        },
        { headers: { "x-user-id": currentUser?.id } }
      );
      showFeedback("success", `Campaign rejected and budget refunded to creator wallet.`);
      await fetchTasks();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to reject task");
    } finally {
      setActionLoading((prev) => ({ ...prev, [task.id]: null }));
    }
  };

  const openTaskEditor = (task) => {
    setEditingTask(task);
    setTaskEditForm({
      id: task.id,
      sourceTable: task.sourceTable || "marketplace_tasks",
      title: task.title || "",
      description: task.description || "",
      instructions: task.instructions || "",
      caption: task.caption || "",
      actionLink: task.action_link || task.target_url || "",
      targetUrl: task.target_url || task.action_link || "",
      earnerFee: task.earner_fee || task.reward_per_worker || 0,
      numberOfTasks: task.number_of_tasks || task.total_slots || 10,
      status: task.status || "pending",
      moderationNotes: task.moderation_notes || "",
    });
  };

  const handleSaveTaskEdit = async (e, publishLive = false) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSavingUser(true);
      const nextStatus = publishLive ? "active" : taskEditForm.status;
      await axios.put(
        "/api/v1/admin/task",
        {
          ...taskEditForm,
          status: nextStatus,
          moderationStatus: nextStatus === "active" ? "approved" : undefined,
        },
        { headers: { "x-user-id": currentUser?.id } }
      );
      showFeedback("success", `Campaign "${taskEditForm.title}" updated successfully${publishLive ? " and published live" : ""}!`);
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to update task");
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleTaskStatus = async (task, nextStatus) => {
    try {
      await axios.put(
        "/api/v1/admin/task",
        {
          id: task.id,
          sourceTable: task.sourceTable || "marketplace_tasks",
          status: nextStatus,
        },
        { headers: { "x-user-id": currentUser?.id } }
      );
      showFeedback("success", `Task "${task.title}" status changed to ${nextStatus}`);
      await fetchTasks();
    } catch (err) {
      showFeedback("error", "Failed to update task status");
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}" permanently?`)) return;
    try {
      await axios.delete(`/api/v1/admin/task?id=${task.id}&sourceTable=${task.sourceTable || "marketplace_tasks"}`, {
        headers: { "x-user-id": currentUser?.id },
      });
      showFeedback("success", "Task deleted successfully");
      await fetchTasks();
    } catch (err) {
      showFeedback("error", "Failed to delete task");
    }
  };

  // Submission Review
  const handleReviewSubmission = async (sub, status) => {
    try {
      await axios.put(
        "/api/v1/admin/submission/review",
        {
          id: sub.id,
          status,
          earnerId: sub.worker_id || sub.user_id || sub.userId,
          earnerFee: sub.reward || sub.reward_amount || sub.earner_fee || sub.earnerFee || 0,
          sourceTable: sub.sourceTable || (sub.task_id && sub.worker_id ? "task_submissions" : "proof_of_work"),
        },
        { headers: { "x-user-id": currentUser?.id } }
      );
      showFeedback("success", `Submission marked as ${status.toUpperCase()}!`);
      await fetchSubmissions();
    } catch (err) {
      showFeedback("error", "Failed to review submission");
    }
  };

  // Manual Deposit Approval
  const handleApproveFunding = async (funding) => {
    try {
      await axios.put(
        "/api/v1/admin/funding/approve",
        {
          id: funding.id,
          userId: funding.user_id || funding.userId,
          amount: funding.amount || funding.amountPaid,
        },
        { headers: { "x-user-id": currentUser?.id } }
      );
      showFeedback("success", `Manual deposit of ₦${funding.amount} approved and credited!`);
      await fetchFundings();
      await fetchAdminOverview();
    } catch (err) {
      showFeedback("error", "Failed to approve manual funding");
    }
  };

  // Price Config Update
  const handleSavePriceItem = async (e) => {
    e.preventDefault();
    if (!editingPriceItem) return;
    try {
      await axios.put("/api/v1/admin/pricing", editingPriceItem, {
        headers: { "x-user-id": currentUser?.id },
      });
      showFeedback("success", `Pricing tier "${editingPriceItem.title}" updated!`);
      setEditingPriceItem(null);
      await fetchPricing();
    } catch (err) {
      showFeedback("error", "Failed to update pricing item");
    }
  };

  // Platform Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await axios.put("/api/v1/admin", adminSettings, {
        headers: { "x-user-id": currentUser?.id },
      });
      showFeedback("success", "Admin platform settings updated successfully!");
    } catch (err) {
      showFeedback("error", "Failed to save platform settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Announcements
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) {
      return showFeedback("error", "Please provide title and announcement message");
    }
    try {
      await axios.post("/api/v1/admin/announcement", newAnnouncement, {
        headers: { "x-user-id": currentUser?.id },
      });
      showFeedback("success", "Announcement published to all dashboards!");
      setNewAnnouncement({ title: "", message: "", type: "info" });
      await fetchAnnouncements();
    } catch (err) {
      showFeedback("error", "Failed to post announcement");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`/api/v1/admin/announcement?id=${id}`, {
        headers: { "x-user-id": currentUser?.id },
      });
      showFeedback("success", "Announcement deleted");
      await fetchAnnouncements();
    } catch (err) {
      showFeedback("error", "Failed to delete announcement");
    }
  };

  // Filters
  const filteredWithdrawals = withdrawals.filter((w) => {
    if (withdrawalFilter === "pending") return w.status === "pending";
    if (withdrawalFilter === "approved") return w.status === "approved";
    if (withdrawalFilter === "disapproved") return w.status === "disapproved";
    return true;
  });

  const filteredUsers = usersList.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.firstname?.toLowerCase().includes(q) ||
      u.lastname?.toLowerCase().includes(q)
    );
  });

  const pendingTasksCount = tasksList.filter((t) => t.status === "pending").length;

  const filteredTasks = tasksList.filter((t) => {
    if (taskFilter === "pending") return t.status === "pending";
    if (taskFilter === "active") return t.status === "active" || t.status === "running";
    if (taskFilter === "paused") return t.status === "paused";
    if (taskFilter === "rejected") return t.status === "rejected";
    if (taskFilter === "completed") return t.status === "completed";
    return true;
  });

  const filteredFundings = fundings.filter((f) => {
    if (fundingFilter === "success") return f.status === "success";
    if (fundingFilter === "pending") return f.status === "pending";
    if (fundingFilter === "failed") return f.status === "failed" || f.status === "cancelled";
    return true;
  });

  return (
    <ClientLayout>
      <div className="font-primary text-slate-800 space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 mb-2">
              <FiShield size={13} /> Complete Admin Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Master Administration Portal
            </h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
              <span>Full visibility across users, wallets, tasks, payouts, deposits, and pricing.</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <FiClock size={11} /> Synced: {lastSynced.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => syncAllData(true)}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
            >
              <FiRefreshCw size={13} className={isSyncing ? "animate-spin text-emerald-400" : ""} />
              <span>{isSyncing ? "Syncing..." : "Sync Live Data"}</span>
            </button>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl">
              Admin: <strong className="text-slate-900">@{currentUser?.username || "Admin"}</strong>
            </span>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback.message && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-2.5 text-sm font-bold shadow-sm ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedback.type === "success" ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Master Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 p-2.5 bg-slate-100/90 rounded-3xl border border-slate-200/80 shadow-xs">
          {[
            { id: "overview", label: "Analytics & KPI", icon: <FiTrendingUp size={15} /> },
            { id: "users", label: `Users (${usersList.length})`, icon: <FiUsers size={15} /> },
            { id: "withdrawals", label: "Withdrawals Queue", icon: <FiCreditCard size={15} />, badge: withdrawals.filter((w) => w.status === "pending").length },
            { id: "fundings", label: "Deposits & Fundings", icon: <FaWallet size={14} /> },
            { id: "tasks", label: `All Campaigns (${tasksList.length})`, icon: <FaBullhorn size={14} />, badge: pendingTasksCount },
            { id: "submissions", label: `Proofs & Submissions (${submissions.length})`, icon: <FiCheckSquare size={15} /> },
            { id: "pricing", label: "Pricing & Rates Engine", icon: <FiTag size={15} /> },
            { id: "settings", label: "Platform Settings", icon: <FiSliders size={15} /> },
            { id: "announcements", label: "Announcements", icon: <FiBell size={15} /> },
            { id: "complaints", label: "Support & Disputes", icon: <FiMessageSquare size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 scale-[1.02]"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 border border-slate-200/90 shadow-2xs"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {tabLoading.overview && totals.totalUsers === 0 ? (
              <StatCardSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Registered</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FiUsers size={18} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    {numeral(totals.totalUsers).format("0,0")}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">User Accounts</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Activated VIPs</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <FaCrown size={16} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600">
                    {numeral(totals.totalMembers).format("0,0")}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">VIP Earner Accounts</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Platform Balances</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FiDollarSign size={18} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                    ₦{numeral(totals.totalBalance).format("0,0.00")}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Total User Wallets Balance</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Pending Payouts</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <FiCreditCard size={18} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-600">
                    {withdrawals.filter((w) => w.status === "pending").length}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Requests Awaiting Approval</span>
                </div>
              </div>
            )}

            {/* Quick Actions & Recent Pending */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <FiCreditCard className="text-emerald-600" />
                    <span>Pending Withdrawals Queue</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("withdrawals")}
                    className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Manage Queue ({withdrawals.filter((w) => w.status === "pending").length}) →
                  </button>
                </div>

                {tabLoading.withdrawals && withdrawals.length === 0 ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-slate-50 rounded-2xl border border-slate-200/60 p-3 flex items-center justify-between">
                        <div className="h-4 w-36 bg-slate-200 rounded"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : withdrawals.filter((w) => w.status === "pending").length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    🎉 No pending withdrawals. All payouts are cleared!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals
                      .filter((w) => w.status === "pending")
                      .slice(0, 5)
                      .map((w) => (
                        <div
                          key={w.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">
                                ₦{numeral(w.amount || w.withdrawalAmount).format("0,0.00")}
                              </span>
                              <span className="text-xs text-slate-500 font-mono">
                                • {w.bankName || w.bankDetails?.bankName || w.bank_name} ({w.accountNumber || w.bankDetails?.accountNumber || w.account_number})
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-0.5">
                              {w.accountName || w.bankDetails?.accountName || w.account_name || "Recipient"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveWithdrawal(w)}
                              disabled={actionLoading[w.id]}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <FiCheck size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleDisapproveWithdrawal(w)}
                              disabled={actionLoading[w.id]}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <FiX size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-4 border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-extrabold text-white text-base">Direct Control Shortcuts</h3>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    Master Admin
                  </span>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-left font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>👥 Edit Any User Profile & Balance</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className="w-full p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-left font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📢 Edit All Campaigns & Tasks</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pricing")}
                    className="w-full p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-left font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>🏷️ Edit Platform Pricing & Pay Rates</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("fundings")}
                    className="w-full p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-left font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>💰 Review All Deposits & Receipts</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. USERS DIRECTORY & FULL EDITOR */}
        {activeTab === "users" && (
          tabLoading.users && usersList.length === 0 ? (
            <TableSkeleton rows={8} cols={7} />
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">User Accounts Directory</h3>
                  <p className="text-xs text-slate-400">Search, inspect, and edit every user's profile, balance, bank details, and roles</p>
                </div>

                <div className="relative w-full sm:w-80">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    placeholder="Search user, email, phone..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Wallet Balance</th>
                      <th className="py-3 px-4">VIP Status</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No users found matching "{userSearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isAdmin = u.role === "admin";
                        const isBanned = u.isBanned || u.is_banned;
                        return (
                          <tr key={u.id || u._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                                  {u.username?.[0]?.toUpperCase() || "U"}
                                </span>
                                <div>
                                  <span className="block text-slate-900 font-bold">@{u.username}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {u.firstname} {u.lastname}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="block text-slate-700 font-medium">{u.email}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{u.phone || "No phone"}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                  isAdmin ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {u.role || "user"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-black text-slate-900 font-mono">
                              ₦{numeral(u.balance || 0).format("0,0.00")}
                            </td>
                            <td className="py-3.5 px-4">
                              {u.isMember || u.is_member ? (
                                <span className="text-amber-600 font-bold flex items-center gap-1 text-[11px]">
                                  <FaCrown size={11} />
                                  <span>PRO VIP</span>
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Free</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isBanned ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {isBanned ? "Banned" : "Active"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => openUserEditor(u)}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                              >
                                <FiEdit size={12} />
                                <span>Edit Full Profile</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* USER EDIT MODAL */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Edit User: @{userEditForm.username}
                  </h3>
                  <p className="text-xs text-slate-400">Modify user profile, wallet balance, and permissions</p>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveUserEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={userEditForm.firstname}
                      onChange={(e) => setUserEditForm({ ...userEditForm, firstname: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={userEditForm.lastname}
                      onChange={(e) => setUserEditForm({ ...userEditForm, lastname: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={userEditForm.email}
                      onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={userEditForm.phone}
                      onChange={(e) => setUserEditForm({ ...userEditForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Direct Balance Adjustment */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                  <span className="text-xs font-black text-emerald-900 block">
                    💰 Wallet Balance & Finances (₦)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                        Available Balance (₦)
                      </label>
                      <input
                        type="number"
                        value={userEditForm.balance}
                        onChange={(e) => setUserEditForm({ ...userEditForm, balance: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm font-black text-slate-900 focus:border-emerald-600 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                        Pending Earnings (₦)
                      </label>
                      <input
                        type="number"
                        value={userEditForm.pendingBalance}
                        onChange={(e) => setUserEditForm({ ...userEditForm, pendingBalance: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm font-black text-slate-900 focus:border-emerald-600 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details & PocketFi Virtual Account Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span className="text-base">🏛️</span> Destination Payout Bank (Withdrawals)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      User Payout Account
                    </span>
                  </div>

                  <datalist id="admin-payout-banks">
                    {availableBanks.map((b) => (
                      <option key={b.code || b.name} value={b.name} />
                    ))}
                  </datalist>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        list="admin-payout-banks"
                        placeholder="e.g. Opay, Kuda, GTBank..."
                        value={userEditForm.bankName || ""}
                        onChange={(e) =>
                          setUserEditForm({ ...userEditForm, bankName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="10-digit Account Number"
                        value={userEditForm.accountNumber || ""}
                        onChange={(e) =>
                          setUserEditForm({ ...userEditForm, accountNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-emerald-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-600">
                          Account Name
                        </label>
                        <button
                          type="button"
                          onClick={handleVerifyBankDetails}
                          disabled={verifyingBank || !userEditForm.accountNumber}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-100/60 hover:bg-emerald-100 px-1.5 py-0.5 rounded transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
                        >
                          {verifyingBank ? (
                            <>
                              <FaSpinner className="animate-spin text-[9px]" /> Verifying...
                            </>
                          ) : (
                            "Verify Name"
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Full Account Name"
                        value={userEditForm.accountName || ""}
                        onChange={(e) =>
                          setUserEditForm({ ...userEditForm, accountName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Dedicated PocketFi Virtual Funding Account Card */}
                  <div className="pt-3 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                        <span className="text-sm">⚡</span> PocketFi Virtual Funding Account (Deposit)
                      </span>
                      {userEditForm.virtualAccountNumber ? (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <FiCheck size={10} /> Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          Not Generated Yet
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Virtual Bank
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Paga / Wema Bank"
                          value={userEditForm.virtualAccountBank || ""}
                          onChange={(e) =>
                            setUserEditForm({ ...userEditForm, virtualAccountBank: e.target.value })
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Virtual Account No.
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Virtual Account Number"
                            value={userEditForm.virtualAccountNumber || ""}
                            onChange={(e) =>
                              setUserEditForm({ ...userEditForm, virtualAccountNumber: e.target.value })
                            }
                            className="w-full px-3 py-1.5 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none font-mono"
                          />
                          {userEditForm.virtualAccountNumber && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(userEditForm.virtualAccountNumber);
                                setCopiedText(userEditForm.virtualAccountNumber);
                                setTimeout(() => setCopiedText(""), 2000);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                              title="Copy account number"
                            >
                              {copiedText === userEditForm.virtualAccountNumber ? (
                                <FaCheck className="text-emerald-500 text-xs" />
                              ) : (
                                <FaCopy className="text-xs" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Virtual Account Name
                        </label>
                        <input
                          type="text"
                          placeholder="Virtual Account Name"
                          value={userEditForm.virtualAccountName || ""}
                          onChange={(e) =>
                            setUserEditForm({ ...userEditForm, virtualAccountName: e.target.value })
                          }
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role, Member, Ban Switches */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                    <select
                      value={userEditForm.role}
                      onChange={(e) => setUserEditForm({ ...userEditForm, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-emerald-500 outline-none"
                    >
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">VIP Membership</label>
                    <select
                      value={userEditForm.isMember ? "true" : "false"}
                      onChange={(e) => setUserEditForm({ ...userEditForm, isMember: e.target.value === "true" })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-emerald-500 outline-none"
                    >
                      <option value="false">Free Member</option>
                      <option value="true">PRO VIP Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ban Status</label>
                    <select
                      value={userEditForm.isBanned ? "true" : "false"}
                      onChange={(e) => setUserEditForm({ ...userEditForm, isBanned: e.target.value === "true" })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-emerald-500 outline-none"
                    >
                      <option value="false">Active / Unbanned</option>
                      <option value="true">Banned / Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingUser}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {savingUser ? <FaSpinner className="animate-spin" size={14} /> : <FiCheck size={14} />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. WITHDRAWALS QUEUE */}
        {activeTab === "withdrawals" && (
          tabLoading.withdrawals && withdrawals.length === 0 ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Withdrawal Payout Requests</h3>
                  <p className="text-xs text-slate-400">Review, approve, or reject user earnings withdrawals</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {["all", "pending", "approved", "disapproved"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setWithdrawalFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                        withdrawalFilter === f ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Recipient Bank</th>
                      <th className="py-3 px-4">Account Number</th>
                      <th className="py-3 px-4">Account Name</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredWithdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No withdrawal requests found for this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredWithdrawals.map((w) => {
                        const isPending = w.status === "pending";
                        const isApproved = w.status === "approved";
                        return (
                          <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 text-slate-500">{formatDate(w.createdAt || w.created_at || w.date)}</td>
                            <td className="py-3.5 px-4 font-black text-slate-900 font-mono">
                              ₦{numeral(w.amount || w.withdrawalAmount).format("0,0.00")}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800">
                              {w.bankName || w.bankDetails?.bankName || w.bank_name || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                              {w.accountNumber || w.bankDetails?.accountNumber || w.account_number || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                              {w.accountName || w.bankDetails?.accountName || w.account_name || "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  isApproved
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : isPending
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {w.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isPending ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleApproveWithdrawal(w)}
                                    disabled={actionLoading[w.id]}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleDisapproveWithdrawal(w)}
                                    disabled={actionLoading[w.id]}
                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs">Processed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* 4. DEPOSITS & FUNDINGS */}
        {activeTab === "fundings" && (
          tabLoading.fundings && fundings.length === 0 ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Wallet Deposits & Funding Logs</h3>
                  <p className="text-xs text-slate-400">Review all automated PocketFi deposits and approve manual transfers</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {["all", "success", "pending"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFundingFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                        fundingFilter === f ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">Date</th>
                      <th className="py-3 px-4 whitespace-nowrap">User</th>
                      <th className="py-3 px-4 whitespace-nowrap">Amount</th>
                      <th className="py-3 px-4 whitespace-nowrap">Reference</th>
                      <th className="py-3 px-4 whitespace-nowrap">Method / Gateway</th>
                      <th className="py-3 px-4 whitespace-nowrap">Status</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredFundings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No funding transaction records found for this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredFundings.map((f) => {
                        const isPending = f.status === "pending";
                        const isSuccess = f.status === "success";
                        const rawMethod = String(f.paymentMethod || f.payment_method || "PocketFi Virtual Account")
                          .replace(/_/g, " ")
                          .toLowerCase();
                        const formattedMethod = rawMethod.includes("pocketfi")
                          ? "PocketFi Virtual Account"
                          : rawMethod.replace(/\b\w/g, (l) => l.toUpperCase());

                        return (
                          <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-medium">
                              {formatDate(f.createdAt || f.created_at)}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {f.users?.username?.[0]?.toUpperCase() || f.username?.[0]?.toUpperCase() || "U"}
                                </span>
                                <span className="font-bold text-slate-900">
                                  @{f.users?.username || f.username || "User"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-black text-slate-900 font-mono whitespace-nowrap">
                              ₦{numeral(f.amount || f.amountPaid).format("0,0.00")}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 max-w-[220px]">
                                <span
                                  className="font-mono text-slate-600 text-[11px] truncate select-all"
                                  title={f.reference}
                                >
                                  {f.reference?.length > 20
                                    ? `${f.reference.slice(0, 10)}...${f.reference.slice(-8)}`
                                    : f.reference || "—"}
                                </span>
                                {f.reference && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(f.reference);
                                      setCopiedText(f.reference);
                                      setTimeout(() => setCopiedText(""), 2000);
                                    }}
                                    className="text-slate-400 hover:text-slate-700 p-0.5 shrink-0 cursor-pointer"
                                    title="Copy full reference"
                                  >
                                    {copiedText === f.reference ? (
                                      <FaCheck className="text-emerald-500 text-[10px]" />
                                    ) : (
                                      <FaCopy className="text-[10px]" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                                <span className="text-amber-500">⚡</span> {formattedMethod}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  isSuccess
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : isPending
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {f.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              {isPending ? (
                                <button
                                  onClick={() => handleApproveFunding(f)}
                                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                >
                                  Approve & Credit
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Auto-credited</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* 5. ALL CAMPAIGNS & TASKS */}
        {activeTab === "tasks" && (
          tabLoading.tasks && tasksList.length === 0 ? (
            <TaskGridSkeleton />
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Campaign Moderation & Task Management</h3>
                  <p className="text-xs text-slate-400">Review pending creator campaigns, edit instructions/quotas, approve to marketplace, or reject with refund.</p>
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: "all", label: "All" },
                    { id: "pending", label: "Pending Review", badge: pendingTasksCount },
                    { id: "active", label: "Active Live" },
                    { id: "paused", label: "Paused" },
                    { id: "rejected", label: "Rejected" },
                    { id: "completed", label: "Completed" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setTaskFilter(f.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer flex items-center gap-1.5 ${
                        taskFilter === f.id ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <span>{f.label}</span>
                      {f.badge > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                          {f.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Campaign Title</th>
                      <th className="py-3 px-4">Type / Category</th>
                      <th className="py-3 px-4">Creator</th>
                      <th className="py-3 px-4">Quota & Progress</th>
                      <th className="py-3 px-4">Earner Reward</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No campaigns found for "{taskFilter}" filter.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((t) => {
                        const isPending = t.status === "pending";
                        const isActive = t.status === "active" || t.status === "running";
                        const isPaused = t.status === "paused";
                        const isRejected = t.status === "rejected";
                        const isCompleted = t.status === "completed";

                        return (
                          <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                              <div className="truncate font-extrabold text-slate-900">{t.title}</div>
                              {t.action_link && (
                                <a
                                  href={t.action_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 font-mono truncate mt-0.5"
                                >
                                  <FiExternalLink size={10} />
                                  <span className="truncate">{t.action_link}</span>
                                </a>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-700 uppercase text-[10px] block">
                                {t.platform || "Web"}
                              </span>
                              <span className="text-[10px] text-slate-400">{t.typeName || "Task"}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              <div className="font-bold text-slate-800">@{t.users?.username || "Creator"}</div>
                              <div className="text-[10px] text-slate-400 truncate">{t.users?.email || "—"}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              {t.tasks_done || 0} / {t.number_of_tasks || 0}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                              ₦{numeral(t.earner_fee || t.earnerFee || 0).format("0,0.00")}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isPending
                                    ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                                    : isActive
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : isPaused
                                    ? "bg-slate-100 text-slate-700 border border-slate-300"
                                    : isRejected
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}
                              >
                                {isPending ? "⏳ Pending Review" : t.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => handleApproveTask(t)}
                                      disabled={actionLoading[t.id] === "approving"}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                    >
                                      <FiCheck size={12} />
                                      <span>Approve & Publish</span>
                                    </button>
                                    <button
                                      onClick={() => openTaskEditor(t)}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                                      title="Edit Campaign Before Approving"
                                    >
                                      <FiEdit size={12} />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDisapproveTask(t)}
                                      disabled={actionLoading[t.id] === "rejecting"}
                                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {isActive && (
                                  <>
                                    <button
                                      onClick={() => handleToggleTaskStatus(t, "paused")}
                                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold cursor-pointer"
                                    >
                                      Pause
                                    </button>
                                    <button
                                      onClick={() => openTaskEditor(t)}
                                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Task"
                                    >
                                      <FiEdit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(t)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Task"
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </>
                                )}

                                {isPaused && (
                                  <>
                                    <button
                                      onClick={() => handleToggleTaskStatus(t, "active")}
                                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer"
                                    >
                                      Activate
                                    </button>
                                    <button
                                      onClick={() => openTaskEditor(t)}
                                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Task"
                                    >
                                      <FiEdit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(t)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Task"
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </>
                                )}

                                {isRejected && (
                                  <>
                                    <button
                                      onClick={() => openTaskEditor(t)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                                    >
                                      Edit & Re-approve
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(t)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Task"
                                    >
                                      <FiTrash2 size={14} />
                                    </button>
                                  </>
                                )}

                                {isCompleted && (
                                  <span className="text-slate-400 text-xs">Completed</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Task Edit & Moderation Modal */}
              {editingTask && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600">
                          <span>🛡️ Admin Campaign Editor</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">
                          Edit & Moderate Campaign
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    <form onSubmit={(e) => handleSaveTaskEdit(e, false)} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Campaign Title
                        </label>
                        <input
                          type="text"
                          value={taskEditForm.title}
                          onChange={(e) => setTaskEditForm({ ...taskEditForm, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-emerald-500 outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Earner Reward (₦ per worker - What users see)
                          </label>
                          <input
                            type="number"
                            value={taskEditForm.earnerFee}
                            onChange={(e) => setTaskEditForm({ ...taskEditForm, earnerFee: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black font-mono focus:bg-white focus:border-emerald-500 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Total Slots / Participants
                          </label>
                          <input
                            type="number"
                            value={taskEditForm.numberOfTasks}
                            onChange={(e) => setTaskEditForm({ ...taskEditForm, numberOfTasks: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black font-mono focus:bg-white focus:border-emerald-500 outline-none"
                            required
                          />
                        </div>
                      </div>

                      {/* Financial & 30% Platform Cut Breakdown */}
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                          <span>Platform Monetization & Escrow Math</span>
                          <span className="text-emerald-400">30% Admin Margin</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                          <div className="bg-slate-800/80 p-2 rounded-xl">
                            <span className="text-[10px] text-slate-400 block">Worker Sees & Earns</span>
                            <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                              ₦{numeral(taskEditForm.earnerFee || 0).format("0,0.00")}
                            </span>
                          </div>
                          <div className="bg-slate-800/80 p-2 rounded-xl">
                            <span className="text-[10px] text-slate-400 block">Admin Cut (30%)</span>
                            <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                              ₦{numeral(Math.round((taskEditForm.earnerFee || 0) * 0.3)).format("0,0.00")}
                            </span>
                          </div>
                          <div className="bg-slate-800/80 p-2 rounded-xl">
                            <span className="text-[10px] text-slate-400 block">Total Advertiser Pays</span>
                            <span className="text-xs sm:text-sm font-black text-white font-mono">
                              ₦{numeral((taskEditForm.earnerFee || 0) + Math.round((taskEditForm.earnerFee || 0) * 0.3)).format("0,0.00")}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic pt-0.5">
                          * Workers on the marketplace only see the <strong>₦{numeral(taskEditForm.earnerFee || 0).format("0,0.00")}</strong> net reward.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Target Link / Action URL
                        </label>
                        <input
                          type="url"
                          value={taskEditForm.actionLink || taskEditForm.targetUrl}
                          onChange={(e) => setTaskEditForm({ ...taskEditForm, actionLink: e.target.value, targetUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Task Instructions / Description
                        </label>
                        <textarea
                          rows={4}
                          value={taskEditForm.instructions || taskEditForm.description || taskEditForm.caption}
                          onChange={(e) => setTaskEditForm({ ...taskEditForm, instructions: e.target.value, description: e.target.value, caption: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Moderation Status
                          </label>
                          <select
                            value={taskEditForm.status}
                            onChange={(e) => setTaskEditForm({ ...taskEditForm, status: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-emerald-500 outline-none"
                          >
                            <option value="pending">Pending Approval (Hidden from earners)</option>
                            <option value="active">Active (Published live to Marketplace)</option>
                            <option value="paused">Paused (Temporarily on hold)</option>
                            <option value="rejected">Rejected (Escrow refunded to creator)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Admin Moderation Notes (Optional)
                          </label>
                          <input
                            type="text"
                            value={taskEditForm.moderationNotes}
                            onChange={(e) => setTaskEditForm({ ...taskEditForm, moderationNotes: e.target.value })}
                            placeholder="e.g. Edited link to correct app download"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingUser}
                          className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {savingUser ? <FaSpinner className="animate-spin" size={13} /> : <FiCheck size={13} />}
                          <span>Save Changes</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleSaveTaskEdit(e, true)}
                          disabled={savingUser}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <FiCheck size={13} />
                          <span>Save & Approve Live 🚀</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* 6. PROOFS & SUBMISSIONS REVIEW */}
        {activeTab === "submissions" && (
          tabLoading.submissions && submissions.length === 0 ? (
            <TableSkeleton rows={6} cols={7} />
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Earner Task Submissions & Proofs</h3>
                <p className="text-xs text-slate-400">Review screenshots and force-approve or reject earner submissions</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Earner</th>
                      <th className="py-3 px-4">Task Info</th>
                      <th className="py-3 px-4">Proof Content / Link</th>
                      <th className="py-3 px-4">Earner Pay</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No submissions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => {
                        const isPending = sub.status === "in_review" || sub.status === "pending" || sub.status === "submitted";
                        const isApproved = sub.status === "approved" || sub.status === "auto_approved";
                        const proofImg = sub.proof_url || sub.image_proof || sub.screenshot || (Array.isArray(sub.proof_urls) ? sub.proof_urls[0] : null);
                        const earnerUsername = sub.username || sub.users?.username || "Earner";
                        const taskName = sub.taskTitle || sub.task_title || sub.title || sub.marketplace_tasks?.title || "Task Proof";
                        const rewardAmt = sub.reward || sub.reward_amount || sub.earner_fee || sub.earnerFee || 100;

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 text-slate-500">{formatDate(sub.createdAt || sub.created_at)}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              @{earnerUsername}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">
                              {taskName}
                            </td>
                            <td className="py-3.5 px-4">
                              {proofImg ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={proofImg}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs border border-emerald-200 transition-colors"
                                  >
                                    <FiExternalLink size={12} />
                                    <span>View Proof Image</span>
                                  </a>
                                </div>
                              ) : (
                                <span className="text-slate-500 text-xs">{sub.proof_text || sub.notes || "Text Submitted"}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                              ₦{numeral(rewardAmt).format("0,0.00")}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  isApproved
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : sub.status === "rejected"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {sub.status === "auto_approved" ? "Auto-Approved" : sub.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isPending && (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleReviewSubmission(sub, "approved")}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReviewSubmission(sub, "rejected")}
                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* 7. PRICING & RATES ENGINE */}
        {activeTab === "pricing" && (
          tabLoading.pricing && pricingConfig.createAdvert.length === 0 ? (
            <PricingSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Creator Advert Rates */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Creator Advert Pricing Rates</h3>
                    <p className="text-xs text-slate-400">Rates charged to advertisers when posting broadcast social media adverts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingConfig.createAdvert.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900">{item.title}</span>
                        <button
                          onClick={() => setEditingPriceItem({ ...item, table: "create_advert_config" })}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                        >
                          <FiEdit size={14} />
                        </button>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900 font-mono">₦{numeral(item.price).format("0,0.00")}</span>
                        <span className="text-xs text-slate-400 font-semibold">per advert</span>
                      </div>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator Engagement Rates */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Creator Engagement Campaign Rates</h3>
                    <p className="text-xs text-slate-400">Rates charged to creators for social follows, likes, comments, and app reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingConfig.createEngagement.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900">{item.title}</span>
                        <button
                          onClick={() => setEditingPriceItem({ ...item, table: "create_engagement_config" })}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer"
                        >
                          <FiEdit size={14} />
                        </button>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-blue-700 font-mono">₦{numeral(item.price).format("0,0.00")}</span>
                        <span className="text-xs text-slate-400 font-semibold">per action</span>
                      </div>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earner Advert Pay Rates */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Earner Advert Pay Rates</h3>
                    <p className="text-xs text-slate-400">Earnings paid out to workers per status advert published</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingConfig.earnAdvert.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900">{item.title}</span>
                        <button
                          onClick={() => setEditingPriceItem({ ...item, table: "earn_advert_config" })}
                          className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg cursor-pointer"
                        >
                          <FiEdit size={14} />
                        </button>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-amber-700 font-mono">₦{numeral(item.price || item.fee).format("0,0.00")}</span>
                        <span className="text-xs text-slate-400 font-semibold">per advert posted</span>
                      </div>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earner Engagement Pay Rates */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Earner Microtask & Engagement Reward Rates</h3>
                    <p className="text-xs text-slate-400">Earnings paid out to workers per microtask completed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingConfig.earnEngagement.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900">{item.title}</span>
                        <button
                          onClick={() => setEditingPriceItem({ ...item, table: "earn_engagement_config" })}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                        >
                          <FiEdit size={14} />
                        </button>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-emerald-700 font-mono">₦{numeral(item.price || item.fee).format("0,0.00")}</span>
                        <span className="text-xs text-slate-500 font-semibold">per action</span>
                      </div>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* PRICING EDIT MODAL */}
        {editingPriceItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">Edit Rate: {editingPriceItem.title}</h3>
                <button onClick={() => setEditingPriceItem(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePriceItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingPriceItem.title}
                    onChange={(e) => setEditingPriceItem({ ...editingPriceItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price / Fee (₦)</label>
                  <input
                    type="number"
                    value={editingPriceItem.price ?? editingPriceItem.fee ?? 0}
                    onChange={(e) => setEditingPriceItem({ ...editingPriceItem, price: Number(e.target.value), fee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={editingPriceItem.description || ""}
                    onChange={(e) => setEditingPriceItem({ ...editingPriceItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPriceItem(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                  >
                    Save Rate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 8. PLATFORM SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Master Platform Pricing & Fees</h3>
              <p className="text-xs text-slate-400">Control system-wide membership costs, payout processing charges, and referral bonuses</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Platform Brand Name</label>
                <input
                  type="text"
                  value={adminSettings.appName}
                  onChange={(e) => setAdminSettings({ ...adminSettings, appName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Membership Activation Fee (₦)</label>
                  <input
                    type="number"
                    value={adminSettings.membershipFee}
                    onChange={(e) => setAdminSettings({ ...adminSettings, membershipFee: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">One-time VIP earner activation cost</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Withdrawal Fee / Charges (₦)</label>
                  <input
                    type="number"
                    value={adminSettings.withdrawalCharges}
                    onChange={(e) => setAdminSettings({ ...adminSettings, withdrawalCharges: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Deducted per payout request</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Minimum Withdrawal Limit (₦)</label>
                  <input
                    type="number"
                    value={adminSettings.minWithdrawal}
                    onChange={(e) => setAdminSettings({ ...adminSettings, minWithdrawal: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Referral VIP Bonus (₦)</label>
                  <input
                    type="number"
                    value={adminSettings.referralBonus}
                    onChange={(e) => setAdminSettings({ ...adminSettings, referralBonus: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
              >
                {savingSettings ? <FaSpinner className="animate-spin" size={16} /> : <FiCheck size={16} />}
                <span>Save Platform Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* 9. ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Broadcast Announcement</h3>
                <p className="text-xs text-slate-400">Post system-wide notices to all user dashboards</p>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. System Maintenance Notice"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Notice Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="info">Info / General</option>
                    <option value="warning">Warning / Alert</option>
                    <option value="success">Success / Promo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Message Content</label>
                  <textarea
                    rows={4}
                    placeholder="Write announcement details..."
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FiBell size={14} />
                  <span>Publish Notice</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
                Active Announcements
              </h3>

              {announcements.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No announcements currently active.
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <div
                      key={a.id || a._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{a.title}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {a.type || "info"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{a.message || a.content}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteAnnouncement(a.id || a._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                        title="Delete Announcement"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 10. COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">User Complaints & Support Tickets</h3>
              <p className="text-xs text-slate-400">View and resolve user reports and inquiries</p>
            </div>

            {complaints.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No support complaints at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div key={c.id || c._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{c.title || c.subject || "Support Inquiry"}</span>
                      <span className="text-xs text-slate-400">{formatDate(c.createdAt || c.date)}</span>
                    </div>
                    <p className="text-xs text-slate-600">{c.message || c.complaint}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default AdminDashboard;
