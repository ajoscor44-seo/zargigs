import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import BackNav from "../components/BackNav/BackNav";
import axios from "axios";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import {
  FaCommentDots,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaRetweet,
  FaShare,
  FaSpinner,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import NoData from "../components/NoData/NoData";
import { SlUserFollowing } from "react-icons/sl";
import { SiAudiomack } from "react-icons/si";
import { IoLogoAppleAppstore, IoShareSocialOutline } from "react-icons/io5";
import { BiLike } from "react-icons/bi";
import numeral from "numeral";
import formatDate from "../hooks/formatDate";
import ProofOfWork from "../components/ProofOfWork/ProofOfWork";
import playStoreImage from "../assets/images/playstore-icon.png";
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
      const response = await axios.get(`/api/v1/tasks/${slug}/${id}`);
      setDetails(response.data[0]);
      return setLoading(false);
    } catch (error) {
      return error;
    }
  };

  const getProofsOfWork = async () => {
    const response = await axios.get(
      `/api/v1/tasks/proofs-of-work?type=${details?.taskType}&platform=${details?.taskPlatform}&id=${details?.id}`
    );
    if (response.data.failed) {
      setProofLoading(false);
      return setError(response.data.message);
    }
    setProofLoading(false);
    return setProofs(response.data);
  };

  useEffect(() => {
    getTaskDetails();
  }, []);

  useEffect(() => {
    getProofsOfWork();
  }, [details, dataChanged]);

  return (
    <div>
      <BackNav
        pageName={"Order Details"}
        usePath={true}
        pathToGo={"/order-history"}
      />
      {loading ? (
        <div className="min-h-96 flex justify-center items-center">
          <FaSpinner size={30} className="text-green-500" />
        </div>
      ) : !details ? (
        <div className="min-h-96 flex justify-center items-center">
          <NoData textBelow={"No Details For This Task"} />
        </div>
      ) : (
        <div className="underBackNav font-primary">
          <div className="flex flex-col justify-center">
            <div
              className="px-1 py-2 flex items-start gap-2 border-b cursor-pointer hover:bg-slate-50"
              key={details.id}
            >
              <div className="flex justify-center items-center border-gray-300 border-2 p-1 rounded-full">
                <ItemIcon
                  platform={details?.taskPlatform}
                  size={20}
                  playstoreSize={"w-5 h-5"}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      {formatDate(details.createdAt)}
                    </span>
                    <h2 className="capitalize font-bold text-xs">
                      {details.taskType == "advert"
                        ? `Post advert on ${details.taskPlatform}`
                        : `${details.taskPlatform} Engagement`}
                    </h2>
                    <span className="methodNote font-semibold text-gray-500">
                      Pricing:{" "}
                      <span className="text-green-500 font-bold">
                        ₦{numeral(details.costPerTask).format("0,0.00")}
                      </span>{" "}
                      {details.taskType == "advert"
                        ? "per advert"
                        : "per engagement"}
                    </span>
                  </div>

                  {details.taskType !== "advert" && (
                    <a
                      href={details.link}
                      className="me-3 text-green-500 text-xs font-semibold hover:underline"
                    >
                      Visit Link
                    </a>
                  )}
                </div>

                <div className="flex justify-between w-full pe-3">
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      {details.taskType == "advert"
                        ? "No of advert posts:"
                        : "No of Engagements:"}
                    </span>
                    <h3 className="text-xs font-semibold">
                      {numeral(details.numberOfTasks).format()}
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      Amount Paid:
                    </span>
                    <h3 className="text-xs font-semibold">
                      ₦
                      {numeral(
                        Number(details.numberOfTasks) *
                          Number(details.costPerTask)
                      ).format("0,0.00")}
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      Allocated Tasks:
                    </span>
                    <h3 className="text-xs font-semibold">
                      {numeral(Number(details.allocatedTasks)).format()}
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      Status:
                    </span>
                    <h3
                      className={`text-xs ${
                        details.allocatedTasks == details.numberOfTasks
                          ? "bg-sky-500"
                          : details.completedTasks == details.numberOfTasks
                          ? "bg-green-600"
                          : "bg-orange-300"
                      } text-white px-1 rounded capitalize font-semibold`}
                    >
                      {details.numberOfTasks == details.completedTasks
                        ? "Completed"
                        : details.numberOfTasks == details.allocatedTasks
                        ? "Allocated"
                        : "Pending"}
                    </h3>
                  </div>
                </div>

                <div className="flex justify-between w-full pe-3">
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      Gender:
                    </span>
                    <h3 className="text-xs font-semibold">{details.gender}</h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      Location:
                    </span>
                    <h3 className="text-xs font-semibold">
                      {details.location}
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      Religion:
                    </span>
                    <h3 className="text-xs font-semibold">
                      {details.religion}
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="methodNote font-semibold text-gray-500">
                      Completed Tasks:
                    </span>
                    <h3 className="text-xs font-semibold">
                      {numeral(Number(details.completedTasks)).format()}
                    </h3>
                  </div>
                </div>

                {details.taskType == "advert" && (
                  <div className="flex justify-between w-full pe-3">
                    <div className="flex flex-col">
                      <span className="methodNote font-semibold text-gray-500">
                        Advert Caption:
                      </span>
                      <h3 className="text-xs font-semibold">
                        {details.caption}
                      </h3>
                    </div>
                    <div className="flex flex-col">
                      <span className="methodNote font-semibold text-gray-500">
                        Advert Image/Video:
                      </span>
                      <h3 className="text-xs font-semibold text-green-500 hover:underline">
                        Click to view
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="py-3 px-4 bg-orange-100">
              <div className="flex">
                <HiOutlineSpeakerphone
                  size={20}
                  className="text-orange-400 items-center me-1"
                />
                <h2 className="text-orange-400 font-semibold">
                  NEW UPDATE!! PLEASE READ
                </h2>
              </div>
              <p className="methodNote mb-2 text-orange-400 font-semibold">
                Please note that we have a dedicated team that verifies all the
                tasks performed by people assigned to you. However, the team
                prioritizes large and bulk orders over smaller orders.
              </p>
              <p className="methodNote mb-2 text-orange-400 font-semibold">
                Therefore, we have created a provision that gives you the power
                to verify what each of the persons assigned to perform your task
                has done. If your order is much or you do not have the time, we
                will also verify the tasks for you. However, you can aid the
                process much faster if you want to verify the tasks yourself.
              </p>
              <p className="methodNote mb-2 text-orange-400 font-semibold">
                Each person that performs your task has to upload a proof or
                screenshot showing that they performed the task. They will also
                enter other information such as social media username, phone
                number or name depending on the task performed.
              </p>
              <p className="methodNote mb-2 text-orange-400 font-semibold">
                You have to verify the tasks by cross-checking the proof or
                screenshot carefully and checking all given parameters to ensure
                that the user has performed the task. If you are convinced that
                the user performed the task, simply click on 'Accept' or click
                'Reject' if the user did not perform the task.
              </p>
            </div>
          </div>

          <div>
            <div className="px-3 py-2 border-y">
              <h2 className="font-bold text-sm">Allocation Results</h2>
              <p className="text-xs methodNote">
                Your order will be allocated to various users so they can
                perform your task for you. You have to verify each of the tasks
                performed by the users below.
              </p>
            </div>
            {proofs.length && !proofLoading ? (
              <div>
                {proofs.map((proof) => (
                  <ProofOfWork
                    proof={proof}
                    key={proof.id}
                    setChange={setDataChanged}
                    setError={setError}
                  />
                ))}
              </div>
            ) : !proofs.length ? (
              <div className="py-5">
                <NoData textBelow={"No Task Allocated Yet"} />
              </div>
            ) : proofLoading ? (
              <div className="py-5 h-40 flex justify-center items-center">
                <FaSpinner size={20} />
              </div>
            ) : (
              <div className="py-5">An error occurred</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
