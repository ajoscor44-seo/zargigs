import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import axios from "axios";
import {
  FaAngleRight,
  FaArrowRight,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import formatDate from "../hooks/formatDate";
import numeral from "numeral";
import { Spinner } from "react-bootstrap";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("engagements");
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    setLoading(true);
    const orders = await axios
      .get(`/api/v1/tasks/${activeTab}`)
      .then((response) => response.data)
      .catch((error) => console.error(error));
    setHistoryData(orders);
    return setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  return (
    <div>
      <BackNav pageName={"My Orders"} />
      <div className="underBackNav font-primary flex flex-col mb-16">
        <div className="grid grid-cols-2 border font-semibold">
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
        <div className="flex flex-col justify-center border">
          {loading ? (
            <Spinner size={25} className="text-green-500" />
          ) : !historyData.length ? (
            <div>No data</div>
          ) : (
            historyData.map((data) => {
              return (
                <Link to={`/order-history/${data.id}`}>
                  <div
                    className="px-1 py-2 flex items-start gap-2 border-b cursor-pointer hover:bg-slate-50"
                    key={data.id}
                  >
                    <div className="flex justify-center items-center border-gray-300 border-2 p-1 rounded-full">
                      {data.taskPlatform.toLowerCase() == "facebook" ? (
                        <FaFacebook className="text-blue-600" size={20} />
                      ) : data.taskPlatform.toLowerCase() == "whatsapp" ? (
                        <FaWhatsapp className="text-green-600" size={20} />
                      ) : data.taskPlatform.toLowerCase() == "instagram" ? (
                        <FaInstagram
                          className="text-white rounded bg-instagram-gradient"
                          size={20}
                        />
                      ) : data.taskPlatform.toLowerCase() == "twitter" ? (
                        <FaTwitter
                          className="bg-white rounded text-sky-500"
                          size={20}
                        />
                      ) : data.taskPlatform.toLowerCase() == "tiktok" ? (
                        <FaTiktok
                          className="bg-white rounded text-purple-500"
                          size={20}
                        />
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
                            Post advert on {data.taskPlatform}
                          </h2>
                          <span className="methodNote font-semibold text-gray-500">
                            Pricing:{" "}
                            <span className="text-green-500 font-bold">
                              ₦{numeral(data.costPerTask).format("0,0.00")}
                            </span>
                          </span>
                        </div>

                        <div className="me-3">
                          <FaAngleRight size={15} className="text-gray-400" />
                        </div>
                      </div>

                      <div className="flex justify-between w-full pe-3">
                        <div className="flex flex-col">
                          <span className="methodNote font-semibold text-gray-500">
                            No of advert posts:
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
                          <h3 className="text-xs bg-orange-300 text-white px-1 rounded capitalize font-semibold">
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
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default TransactionHistory;
