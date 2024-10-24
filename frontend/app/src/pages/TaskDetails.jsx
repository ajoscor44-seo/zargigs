import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import BackNav from "../components/BackNav/BackNav";
import axios from "axios";
import PendingTaskSubtask from "../components/PendingtaskSubtask/PendingTaskSubtask";
import Subtask from "../components/Subtask/Subtask";
import { FaCopy, FaFileCircleCheck, FaSpinner } from "react-icons/fa6";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import { BsCamera } from "react-icons/bs";
import { storage } from "../config/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import formatDate from "../hooks/formatDate";
import CopyToClipboard from "../hooks/CopyToClipboard";
import { FaFileDownload } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import DownloadPermissionChecker from "../components/CheckPermissions/CheckPermissions";

const TaskDetails = () => {
  const { adminData, fetchUserData } = useAuth();
  const history = useHistory();
  const { slug, platform, status, id, type } = useParams();
  const [taskDetails, setTaskDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [textIsCopied, setTextIsCopied] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [username, setUsername] = useState(null);
  const fileInputRef = useRef();
  const captionRef = useRef();
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(null);

  // Copies caption
  const copyToClipboard = (inputRef) => {
    const textIsCopied = CopyToClipboard(inputRef);

    if (textIsCopied) setTextIsCopied(true);

    const timeToReset = setTimeout(() => {
      setTextIsCopied(false);
      return clearTimeout(timeToReset);
    }, 5000);
  };

  // Selects Profile Picture
  const selectProfilePic = () => {
    if (status !== "pending") {
      return;
    }
    fileInputRef.current.click();
  };

  // Handles File Input
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file chosen.");
      return;
    }

    if (file.type.startsWith("image") && file.size > 2097152) {
      // 2 MB for images
      alert("The photo is too large. Maximum size is 2 MB.");
      e.target.value = ""; // Reset the input
    } else if (file.type.startsWith("video")) {
      // 100 MB for videos
      alert("You cannot upload this file type.");
      e.target.value = ""; // Reset the input
    } else {
      alert("File is accepted.");
      // Handle the file upload process here
      return uploadProfilePic(file);
    }
  };

  // Upload Profile Picture
  const uploadProfilePic = (image) => {
    setImagePercentage(null);
    setImageError(null);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, "proof_of_works/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Returns the progress of the image
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImagePercentage(progress);
      },
      (error) => {
        setImagePercentage(null);
        return setImageError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImage(downloadUrl);
          setImageError(null);
        });
      }
    );
    return;
  };

  const getTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/tasks/task/${id}?type=${type}&platform=${platform}&status=${status}`
      );

      if (response.data.failed) {
        setError(response.data.message);
        setLoading(false);
        return setTaskDetails({});
      }

      setLoading(false);
      return setTaskDetails(response.data);
    } catch (error) {
      return setError(error);
    }
  };

  // Cancels generated task
  const cancelGeneratedTask = async (status) => {
    if (status.toLowerCase() !== "pending") return;
    setLoading(true);
    try {
      await axios.delete(
        `/api/v1/tasks/cancel-task?type=${
          taskDetails?.taskType
        }&platform=${taskDetails.taskPlatform.toLowerCase()}`
      );

      setLoading(false);
      return history.push(`/earn/${slug}`);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const uploadTaskForReview = async () => {
    try {
      if (!username) {
        return setUploadError("Please input your social media username.");
      }
      if (!image) {
        return setUploadError("Please upload your proof of work.");
      }
      setLoading(true);
      const response = await axios.post("/api/v1/tasks/request-review", {
        username,
        image,
        id: taskDetails?.allocationId,
        createdBy: taskDetails?.createdBy,
        type,
        platform: taskDetails?.taskPlatform,
        parentId: taskDetails?.parentId,
        title: taskDetails?.title,
        link: taskDetails?.link,
        caption: taskDetails?.caption,
        mediaUrl: taskDetails?.mediaUrl,
      });

      if (response.data.failed) {
        setUploadError(response.data.message);
        setLoading(false);
        return setTaskDetails({});
      }
      setUploadError(null);
      setLoading(false);
      if (slug === "null") {
        return history.push("/tasks-history");
      }
      await fetchUserData();
      return history.push(`/earn/${slug}`);
    } catch (error) {
      setLoading(false);
      return setUploadError(error);
    }
  };

  const getMediaExtension = (mediaUrl) => {
    // Find the last dot before the query string starts
    const lastDotIndex = mediaUrl.lastIndexOf(".");
    const queryStartIndex = mediaUrl.indexOf("?");
    let extension;

    if (lastDotIndex === -1) {
      return null; // No extension found
    }

    extension =
      queryStartIndex === -1
        ? mediaUrl.substring(lastDotIndex + 1).toLowerCase()
        : mediaUrl.substring(lastDotIndex + 1, queryStartIndex).toLowerCase();

    const validExtensions = new Set([
      "jpg",
      "jpeg",
      "png",
      "mp4",
      "mp3",
      "mov",
    ]);
    return validExtensions.has(extension) ? extension : null;
  };

  const downloadMedia = async () => {
    try {
      const mediaUrl = taskDetails?.mediaUrl;
      if (!mediaUrl) {
        alert("Media URL is missing.");
        return;
      }

      // Get the download URL from Firebase Storage
      const storageRef = ref(storage, mediaUrl); // Replace with the correct path
      const url = await getDownloadURL(storageRef);

      const mediaExtension = getMediaExtension(mediaUrl);
      if (mediaExtension) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          const blob = xhr.response;
          const downloadUrl = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = downloadUrl;
          anchor.download = `${taskDetails?.id}_advert_media.${mediaExtension}`;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          window.URL.revokeObjectURL(downloadUrl);
        };
        xhr.open("GET", url);
        xhr.send();
      } else {
        alert("Unsupported media type, file must be an image or video");
      }
    } catch (error) {
      alert("An error occurred while attempting to download the media.");
      console.error("Error downloading the media:", error);
    }
  };

  useEffect(() => {
    getTaskDetails();
  }, []);

  useEffect(() => {
    if (status == "in-review" || status == "completed") {
      return setImage(taskDetails?.proof?.imageUrl);
    }
  }, [taskDetails]);

  return (
    <div className="font-primary">
      <BackNav
        pageName={"Task Details"}
        pathToGo={slug === "null" ? "/tasks-history" : `/earn/${slug}`}
        usePath={true}
      />
      <div className="underBackNav mb-16">
        <DownloadPermissionChecker />
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <FaSpinner className="text-green-500" size={25} />
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>
            <div>
              {status == "pending" ? (
                <PendingTaskSubtask
                  slug={slug}
                  task={taskDetails}
                  hideBtn={true}
                  cancelTask={cancelGeneratedTask}
                  platform={platform}
                  type={type}
                  status={status}
                />
              ) : (
                <Subtask
                  slug={slug}
                  platform={platform}
                  status={status}
                  type={type}
                  task={taskDetails}
                  hideBtn={true}
                />
              )}
            </div>
            <div className="mx-2 py-3 flex flex-col gap-1">
              <span className="font-semibold text-sm" hidden={type == "advert"}>
                Task Link
              </span>
              {type == "advert" ||
              taskDetails?.taskPlatform?.toLowerCase() == "allcomment" ? (
                <div className="flex">
                  <span className="flex-1 flex items-center bg-gray-200 px-2 rounded-s-sm text-sm truncate pe-2">
                    {taskDetails?.taskPlatform?.toLowerCase() == "allcomment"
                      ? taskDetails?.customComment
                      : taskDetails?.caption}
                  </span>
                  <textarea
                    ref={captionRef}
                    rows={25}
                    className="p-2 border bg-slate-200 rounded-s absolute opacity-0 h-0 w-0"
                    defaultValue={
                      taskDetails?.taskPlatform?.toLowerCase() == "allcomment"
                        ? taskDetails?.customComment
                        : taskDetails?.caption
                    }
                  ></textarea>
                  <span
                    className="w-fit flex justify-center items-center px-2 text-green-500 bg-green-100"
                    onClick={() => copyToClipboard(captionRef)}
                  >
                    {textIsCopied ? (
                      <FaFileCircleCheck size={20} />
                    ) : (
                      <FaCopy size={20} />
                    )}
                  </span>
                  {type == "advert" && (
                    <button
                      onClick={downloadMedia}
                      className="bg-green-500 flex items-center gap-1 outline-none py-2 text-center px-3 font-semibold rounded-e-sm text-sm cursor-pointer text-white"
                    >
                      <span>Download</span> <FaFileDownload size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex" hidden={type == "advert"}>
                  <span className="flex-1 flex items-center bg-gray-200 px-2 rounded-s-sm text-sm truncate pe-2">
                    {taskDetails?.link}
                  </span>
                  <a
                    target="_blank"
                    href={taskDetails?.link}
                    className="bg-yellow-500 py-2 flex justify-center items-center px-3 font-semibold rounded-e-sm text-sm cursor-pointer text-white"
                  >
                    Visit Link
                  </a>
                </div>
              )}
              <p
                hidden={type == "advert" || platform === "website"}
                className="text-xs text-gray-400 font-semibold"
              >
                The task you are given is to engage the account on social media
                pages.
              </p>
              <p
                hidden={type == "advert"}
                className="text-xs text-gray-400 font-semibold"
              >
                The task you are given is to engage the website you are being
                redirected to from this page.
              </p>
              <p
                hidden={type !== "advert" || platform == "website"}
                className="text-xs text-gray-400 font-semibold"
              >
                The task you are given is to post this advert on {platform}{" "}
                using the social media account linked to {adminData?.appName} .
              </p>

              {status == "failed" ? (
                <div className="text-orange-400 font-semibold bg-orange-100 rounded text-sm p-3 mt-2">
                  Your task was disapproved because{" "}
                  <span className="font-bold text-orange-500 capitalize">
                    {taskDetails?.reason || "your proof was found invalid"}
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="font-bold text-xs">
                    Please follow the step-by-step instruction below to do your
                    task:
                  </p>
                  <div className="text-sm flex flex-col gap-2 mt-1 ms-2">
                    <p>
                      {type === "advert" ? (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 1: </span> Download
                          the advert media using the download button above.
                        </p>
                      ) : (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 1: </span> Visit the
                          task link above by clicking the{" "}
                          <span className="font-bold">"Visit Link"</span> button
                          or by copying and pasting the link into your browser.
                        </p>
                      )}
                    </p>
                    <p>
                      {type === "advert" ? (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 2: </span>Copy the
                          advert caption and post it with the advert media
                          caption on the selected social media.
                        </p>
                      ) : (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 2: </span>The link
                          will direct you to the{" "}
                          {platform === "website"
                            ? "site"
                            : "social media page"}{" "}
                          where you are to excute your task.
                        </p>
                      )}
                    </p>
                    <p>
                      {platform === "website" && type !== "advert" ? (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 3: </span> Scroll to
                          the bottom of the site or{" "}
                          <span className="text-red-500 font-bold">
                            follow the instruction being given if given any
                          </span>{" "}
                        </p>
                      ) : (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 3: </span> Perform
                          the task on this social media page and ensure you{" "}
                          <span className="text-red-500 font-bold">
                            DO NOT UNDO
                          </span>{" "}
                          any task you did as it might lead to your account
                          being banned.
                        </p>
                      )}
                    </p>
                    <p>
                      {type !== "advert" && platform == "website" ? (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 4: </span>Create a
                          screenshot of the footer of page that shows that you
                          have performed the task and upload the screenshot as a
                          proof under Proof of Work Form below. You are also
                          required to enter your gigsflix media account username
                          which you used to perform the task.
                        </p>
                      ) : (
                        <p className="text-xs font-semibold">
                          <span className="font-bold">Step 4: </span>Create a
                          screenshot of the page that shows that you have
                          performed the task and upload the screenshot as a
                          proof under Proof of Work Form below. You are also
                          required to enter your social media account username
                          which you used to perform the task.
                        </p>
                      )}
                    </p>
                    <p>
                      {taskDetails?.description &&
                        "Poster said: " + taskDetails?.description}
                    </p>
                  </div>
                  <div className="text-orange-400 font-semibold bg-orange-100 rounded text-xs p-3 mt-2">
                    You must{" "}
                    <span className="font-bold text-orange-500">NOT UNDO</span>{" "}
                    any task you perform as it may result to your{" "}
                    {adminData?.appName} account getting banned. You will not be
                    able to perform any task if you{" "}
                    <span className="font-bold text-orange-500">UNDO</span> any
                    task performed
                  </div>
                </div>
              )}

              {(status == "pending" ||
                status == "in-review" ||
                status == "completed") && (
                <div className="mt-2">
                  <p className="font-bold text-xs">
                    {status == "pending" && "Upload"} Proof of Work:
                  </p>
                  <p className="methodeNote text-green-500 font-bold text-center">
                    {imagePercentage}
                  </p>
                  <p className="methodeNote text-red-500 font-bold text-center">
                    {uploadError || imageError}
                  </p>
                  <div className="flex mt-2 gap-2 text-gray-500">
                    <div>
                      {image ? (
                        <img
                          src={image}
                          className="w-20 h-20 border rounded bg-gray-200"
                        />
                      ) : (
                        <div
                          className="methodNote flex flex-col gap-1 justify-center items-center bg-gray-200 py-6 px-3 rounded"
                          onClick={selectProfilePic}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                            accept="image/*"
                            style={{ display: "none" }}
                          />
                          <BsCamera size={20} />
                          <span>Upload Screenshot</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="methodNote" hidden={status !== "pending"}>
                        Please enter the username of the social media account
                        you used to perform the task.{" "}
                        <span className="font-bold text-orange-400">
                          ENSURE THE USERNAME IS CORRECT
                        </span>
                        .
                      </p>
                      <p className="methodNote" hidden={status == "pending"}>
                        This is the social media username you used to perform
                        this task.{" "}
                        <span className="font-bold text-red-400">
                          NOTE: THIS USERNAME CANNOT BE EDITED
                        </span>
                        .
                      </p>
                      <h2
                        className="font-bold mb-0 text-sm"
                        hidden={
                          status !== "in-review" &&
                          status !== "completed" &&
                          status !== "failed"
                        }
                      >
                        Username:{" "}
                        <span className="text-green-500">
                          {taskDetails?.proof?.username}
                        </span>
                      </h2>
                      <span
                        className="text-xs font-bold text-gray-400"
                        hidden={
                          status !== "in-review" &&
                          status !== "completed" &&
                          status !== "failed"
                        }
                      >
                        Submitted At:{" "}
                        <span className="text-gray-300">
                          {formatDate(taskDetails?.proof?.createdAt)}
                        </span>
                      </span>
                      <input
                        type="text"
                        name="taskPerformerUsername"
                        hidden={status !== "pending"}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your social media username here"
                        className="border w-full p-2 outline-none placeholder:text-xs mt-1"
                      />
                      <button
                        onClick={uploadTaskForReview}
                        hidden={status !== "pending"}
                        className="border px-2 py-1 mt-1 bg-green-500 text-white rounded text-xs"
                      >
                        Upload Proof
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default TaskDetails;
