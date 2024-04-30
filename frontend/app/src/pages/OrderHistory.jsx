import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import axios from "axios";
import {
  FaAngleRight,
  FaCommentDots,
  FaFacebook,
  FaInstagram,
  FaRetweet,
  FaShare,
  FaSpinner,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import formatDate from "../hooks/formatDate";
import numeral from "numeral";
import { IoLogoAppleAppstore, IoShareSocialOutline } from "react-icons/io5";
import { Link } from "react-router-dom/cjs/react-router-dom";
import NoData from "../components/NoData/NoData";
import { SlUserFollowing } from "react-icons/sl";
import { SiAudiomack } from "react-icons/si";
import { BiLike } from "react-icons/bi";

const TransactionHistory = () => {
  const [perPage, setPerpage] = useState(10);
  const [activeTab, setActiveTab] = useState("engagements");
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    setLoading(true);
    const orders = await axios
      .get(`/api/v1/tasks/${activeTab}?page=1&limit=${perPage}`)
      .then((response) => response.data)
      .catch((error) => console.error(error));
    setHistoryData(orders);
    return setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab, perPage]);

  return (
    <div>
      <BackNav pageName={"My Orders"} />
      <div className="underBackNav font-primary flex flex-col mb-16">
        <div className="grid grid-cols-2 border font-semibold fixed bg-white w-full">
          <div
            className={
              activeTab == "engagements"
                ? "text-center p-2 bg-slate-200 text-sm cursor-pointer"
                : "text-center p-2 text-sm cursor-pointer"
            }
            onClick={() => setActiveTab("engagements")}
          >
            Engagements History
          </div>
          <div
            className={
              activeTab == "adverts"
                ? "text-center p-2 bg-slate-200 text-sm cursor-pointer"
                : "text-center p-2 text-sm cursor-pointer"
            }
            onClick={() => setActiveTab("adverts")}
          >
            Adverts History
          </div>
        </div>
        <div className="flex flex-col justify-center mt-10">
          {loading ? (
            <div className="min-h-96 flex justify-center items-center">
              <FaSpinner size={30} className="text-green-500" />
            </div>
          ) : !historyData.data?.length ? (
            <div className="min-h-96 flex justify-center items-center">
              <NoData textBelow={"No Advert History Available"} />
            </div>
          ) : (
            historyData.data?.map((data) => {
              return (
                <Link to={`/order-history/${activeTab}/${data.id}`} key={data.id}>
                  <div
                    className="px-1 py-2 flex items-start gap-2 border-b cursor-pointer hover:bg-slate-50"
                    key={data.id}
                  >
                    <div className="flex justify-center items-center border-gray-300 border-2 p-1 rounded-full">
                      {data.taskPlatform.toLowerCase() === "facebook" ? (
                        <FaFacebook className="text-blue-600" size={20} />
                      ) : data.taskPlatform.toLowerCase() === "instagram" ? (
                        <FaInstagram
                          size={20}
                          className="text-white bg-instagram-gradient rounded"
                        />
                      ) : data.taskPlatform.toLowerCase() === "allfollow" ? (
                        <SlUserFollowing size={20} className="text-blue-400" />
                      ) : data.taskPlatform.toLowerCase() === "tiktok" ? (
                        <FaTiktok size={20} className="text-white bg-black" />
                      ) : data.taskPlatform.toLowerCase() === "audiomack" ? (
                        <SiAudiomack
                          size={20}
                          className="text-orange-500 bg-black"
                        />
                      ) : data.taskPlatform.toLowerCase() === "twitter" ? (
                        <FaTwitter size={20} className="text-sky-500" />
                      ) : data.taskPlatform.toLowerCase() === "applestore" ? (
                        <IoLogoAppleAppstore
                          size={20}
                          className="text-blue-500 bg-white rounded-full"
                        />
                      ) : data.taskPlatform.toLowerCase() === "playstore" ? (
                        <img
                          src={playStoreImage}
                          className="w-20 h-20 object-cover"
                        />
                      ) : data.taskPlatform.toLowerCase() === "allretweets" ? (
                        <FaRetweet
                          size={20}
                          className="text-blue-500 bg-white"
                        />
                      ) : data.taskPlatform.toLowerCase() === "allshare" ? (
                        <FaShare
                          size={20}
                          className="text-white rounded-full bg-instagram-gradient"
                        />
                      ) : data.taskPlatform.toLowerCase() === "allcomments" ? (
                        <FaCommentDots
                          size={20}
                          className="text-green-400 bg-white"
                        />
                      ) : data.taskPlatform.toLowerCase() === "telegram" ? (
                        <FaTelegram
                          size={20}
                          className="text-blue-400 bg-white"
                        />
                      ) : data.taskPlatform.toLowerCase() === "alllike" ? (
                        <BiLike size={20} className="bg-white text-blue-500" />
                      ) : data.taskPlatform.toLowerCase() === "youtube" ? (
                        <FaYoutube size={20} className="text-red-500" />
                      ) : data.taskPlatform.toLowerCase() === "whatsapp" ? (
                        <FaWhatsapp size={20} className="text-green-500" />
                      ) : (
                        <IoShareSocialOutline
                          className="text-green-500"
                          size={20}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <span className="methodNote font-semibold text-gray-500">
                            {formatDate(data.createdAt)}
                          </span>
                          <h2 className="capitalize font-bold text-xs">
                            {data.taskType == "advert"
                              ? `Post advert on ${data.taskPlatform}`
                              : `${data.taskPlatform} Engagement`}
                          </h2>
                          <span className="methodNote font-semibold text-gray-500">
                            Pricing:{" "}
                            <span className="text-green-500 font-bold">
                              ₦{numeral(data.costPerTask).format("0,0.00")}
                            </span>{" "}
                            {data.taskType == "advert"
                              ? "per advert"
                              : "per engagement"}
                          </span>
                        </div>

                        <div className="me-3">
                          <FaAngleRight size={15} className="text-gray-400" />
                        </div>
                      </div>

                      <div className="flex justify-between w-full pe-3">
                        <div className="flex flex-col">
                          <span className="methodNote font-semibold text-gray-500">
                            {data.taskType == "advert"
                              ? "No of advert posts:"
                              : "No of Engagements:"}
                          </span>
                          <h3 className="text-xs font-semibold">
                            {numeral(data.numberOfTasks).format()}
                          </h3>
                        </div>
                        <div className="flex flex-col">
                          <span className="methodNote font-semibold text-gray-500">
                            Amount Paid:
                          </span>
                          <h3 className="text-xs font-semibold">
                            ₦
                            {numeral(
                              Number(data.numberOfTasks) *
                                Number(data.costPerTask)
                            ).format("0,0.00")}
                          </h3>
                        </div>
                        <div className="flex flex-col">
                          <span className="methodNote font-semibold text-gray-500">
                            Status:
                          </span>
                          <h3
                            className={`text-xs ${
                              data.status.toLowerCase() == "pending"
                                ? "bg-orange-300"
                                : data.status.toLowerCase() == "completed"
                                ? "bg-green-600"
                                : data.status.toLowerCase() == "allocating"
                                ? "bg-blue-600"
                                : data.status.toLowerCase() == "cancelled"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            } text-white px-1 rounded capitalize font-semibold`}
                          >
                            {data.status}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
        {!loading &&
          historyData?.meta.total > 0 &&
          historyData?.meta.total !== historyData?.data.length && (
            <div
              className="text-center font-bold text-green-500 py-5 cursor-pointer"
              onClick={(prev) => setPerpage(prev + 5)}
            >
              Load More...
            </div>
          )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default TransactionHistory;
