import React, { useEffect, useState } from "react";
import AdvertItem from "../AdvertItem/AdvertItem";
import { FiPlus, FiClock, FiCheckCircle, FiShare2, FiImage, FiTrendingUp } from "react-icons/fi";
import { RiMegaphoneLine, RiTwitterXLine, RiWhatsappLine, RiInstagramLine, RiFacebookCircleLine, RiTiktokLine } from "react-icons/ri";
import { FaSpinner, FaUsers } from "react-icons/fa6";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../config/supabase.config";
import numeral from "numeral";
import formatDate from "../../hooks/formatDate";
import { Link } from "react-router-dom/cjs/react-router-dom";

const PlatformIcon = ({ platform }) => {
  const p = (platform || "").toLowerCase();
  if (p.includes("twitter") || p.includes("x")) return <RiTwitterXLine className="text-black" size={20} />;
  if (p.includes("whatsapp")) return <RiWhatsappLine className="text-emerald-500" size={20} />;
  if (p.includes("instagram")) return <RiInstagramLine className="text-pink-600" size={20} />;
  if (p.includes("facebook")) return <RiFacebookCircleLine className="text-blue-600" size={20} />;
  if (p.includes("tiktok")) return <RiTiktokLine className="text-slate-900" size={20} />;
  return <RiMegaphoneLine className="text-emerald-600" size={20} />;
};

const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  if (s === "active" || s === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Active / Running
      </span>
    );
  }
  if (s === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <FiCheckCircle size={12} />
        Completed
      </span>
    );
  }
  if (s === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        Rejected / Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
      <FiClock size={12} className="animate-spin" />
      Pending Admin Review
    </span>
  );
};

const AdvertTaskCard = ({ item }) => {
  const tasksDone = Number(item.tasks_done || item.tasksDone || 0);
  const totalTasks = Number(item.number_of_tasks || item.numberOfTasks || 1);
  const progressPercent = Math.min(100, Math.round((tasksDone / totalTasks) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100/90 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
              <PlatformIcon platform={item.platform || item.taskPlatform} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                {item.title || "Social Media Advert"}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Created on {formatDate(item.created_at || item.createdAt)}
              </p>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {item.caption && (
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 mb-4 text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">
            "{item.caption}"
          </div>
        )}

        {item.media_url && (
          <div className="relative rounded-2xl overflow-hidden mb-4 border border-slate-100 max-h-40 bg-slate-100 flex items-center justify-center">
            {item.media_url.match(/\.(mp4|webm|mov)$/i) ? (
              <video src={item.media_url} className="w-full h-36 object-cover" controls />
            ) : (
              <img src={item.media_url} alt="Campaign Media" className="w-full h-36 object-cover" />
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <FaUsers size={12} className="text-emerald-600" />
              Broadcast Progress
            </span>
            <span className="text-slate-800 font-extrabold">
              {tasksDone} of {totalTasks} posts ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs">
            <span className="text-slate-400 font-medium">Budget: </span>
            <span className="font-extrabold text-slate-900">
              ₦{numeral(item.amount_paid || item.amountPaid || 0).format("0,0.00")}
            </span>
          </div>

          <Link
            to={`/order-history/adverts/${item.id || item._id}`}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            View Submissions & Proofs →
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdvertisementList = ({ setCreatingAdvert }) => {
  const { currentUser } = useAuth();
  const [advertisementList, setAdvertisementList] = useState([]);
  const [advertTasks, setAdvertTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const userId = currentUser?.id || currentUser?._id;

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Advert Tasks created by this user from Supabase and API
      let tasksList = [];
      try {
        if (userId) {
          const { data: dbTasks } = await supabase
            .from("advert_tasks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (dbTasks && dbTasks.length > 0) {
            tasksList = dbTasks;
          }
        }

        if (tasksList.length === 0) {
          const apiRes = await axios.get("/api/v1/tasks/adverts?limit=50", {
            headers: { "x-user-id": userId || "" },
          });
          tasksList = apiRes.data?.data || apiRes.data || [];
        }
      } catch (err) {
        console.warn("Advert tasks fetch notice:", err);
      }

      // 2. Fetch Banner Advertisements
      let bannersList = [];
      try {
        const bannerRes = await axios.get("/api/v1/advertisements/user", {
          headers: { "x-user-id": userId || "" },
        });
        bannersList = bannerRes.data?.data || [];
      } catch (err) {
        console.warn("Banner ads fetch notice:", err);
      }

      setAdvertTasks(tasksList);
      setAdvertisementList(bannersList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const totalItemsCount = advertTasks.length + advertisementList.length;

  return (
    <div className="space-y-6">
      {/* Quick Summary Badges */}
      {totalItemsCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            All Campaigns ({totalItemsCount})
          </button>
          <button
            onClick={() => setActiveFilter("tasks")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "tasks"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            Social / Status Adverts ({advertTasks.length})
          </button>
          {advertisementList.length > 0 && (
            <button
              onClick={() => setActiveFilter("banners")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "banners"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              Banner Ads ({advertisementList.length})
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <FaSpinner className="animate-spin text-emerald-600" size={30} />
        </div>
      ) : totalItemsCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Broadcast / Status Advert Tasks */}
          {activeFilter !== "banners" &&
            advertTasks.map((task) => (
              <AdvertTaskCard key={task.id || task._id} item={task} />
            ))}

          {/* 2. Banner Advertisements */}
          {activeFilter !== "tasks" &&
            advertisementList.map((advertisement) => (
              <AdvertItem key={advertisement.id || advertisement._id} itemData={advertisement} />
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <RiMegaphoneLine size={28} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-1">
            No Active Advertisements
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
            Promote your products, channels, and services to thousands of verified users on DocsZar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/advertise"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FiShare2 size={16} />
              <span>Launch Social Status Advert</span>
            </Link>
            <button
              onClick={() => setCreatingAdvert(true)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <FiPlus size={16} />
              <span>Create Banner Advert</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementList;
