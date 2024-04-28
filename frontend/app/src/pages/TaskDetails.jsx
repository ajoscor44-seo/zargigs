import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import BackNav from "../components/BackNav/BackNav";
import axios from "axios";
import PendingTaskSubtask from "../components/PendingtaskSubtask/PendingTaskSubtask";
import Subtask from "../components/Subtask/Subtask";
import { FaSpinner } from "react-icons/fa6";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import { BsCamera } from "react-icons/bs";
import { storage } from "../config/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import formatDate from "../hooks/formatDate";

const TaskDetails = () => {
  const history = useHistory();
  const { slug, platform, status, id, type } = useParams();
  const [taskDetails, setTaskDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [username, setUsername] = useState(null);
  const fileInputRef = useRef();
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(null);

  // Selects Profile Picture
  const selectProfilePic = () => {
    if (status !== "pending") {
      return;
    }
    fileInputRef.current.click();
  };

  // Handles File Input
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    return uploadProfilePic(file);
  };

  // Upload Profile Picture
  const uploadProfilePic = (image) => {
    setImagePercentage(null);
    setImageError(null);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
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
        `/api/v1/tasks/task/${id}?type=engagement&platform=${platform}&status=${status}`
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
        type,
        platform: taskDetails?.taskPlatform,
        parentId: taskDetails?.parentId,
        title: taskDetails.title,
        link: taskDetails.link,
        earningPerTask: taskDetails.earningPerTask,
      });

      if (response.data.failed) {
        setUploadError(response.data.message);
        setLoading(false);
        return setTaskDetails({});
      }
      setUploadError(null);
      setLoading(false);
      return history.push(`/earn/${slug}`);
    } catch (error) {
      return setUploadError(error);
    }
  };

  useEffect(() => {
    getTaskDetails();
    if (status == "in-review") {
      return setImage(taskDetails?.proof?.imageUrl);
    }
  }, [image]);

  return (
    <div className="font-primary">
      <BackNav
        pageName={`Task ${id}`}
        pathToGo={`/earn/${slug}`}
        usePath={true}
      />
      <div className="underBackNav mb-16">
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
                <PendingTaskSubtask task={taskDetails} hideBtn={true} />
              ) : (
                <Subtask task={taskDetails} hideBtn={true} />
              )}
            </div>
            <div className="mx-2 py-3 flex flex-col gap-1">
              <span className="font-semibold text-sm">Task Link</span>
              <div className="flex">
                <span className="flex-1 flex items-center bg-gray-200 px-2 rounded-s-sm text-sm truncate pe-2">
                  {taskDetails?.link}
                </span>
                <a
                  target="_blank"
                  href={taskDetails?.link}
                  className="bg-yellow-500 py-2 flex justify-center items-center px-3 font-semibold rounded-e-sm text-sm cursor-pointer"
                >
                  Visit Link
                </a>
              </div>
              <p className="text-xs text-gray-400 font-semibold">
                The task you are given is to engage this accounts on social
                media pages.
              </p>

              <div className="mt-2">
                <p className="font-bold text-xs">
                  Please the step-by-step instruction below to do your task:
                </p>
                <div className="text-sm flex flex-col gap-2 mt-1 ms-2">
                  <p className="text-xs font-semibold">
                    <span className="font-bold">Step 1: </span> Visit the task
                    link above by clicking the{" "}
                    <span className="font-bold">"Visit Link"</span> button or by
                    copying and pasting the link into your browser.
                  </p>
                  <p className="text-xs font-semibold">
                    <span className="font-bold">Step 2:</span>the link will
                    direct you to the social media page where you are to excute
                    your task.
                  </p>
                  <p className="text-xs font-semibold">
                    <span className="font-bold">Step 3: </span> Perform the task
                    on this social media page and ensure you{" "}
                    <span className="text-red-500 font-bold">DO NOT UNDO</span>{" "}
                    any task you did cos it might lead to your account being
                    banned.
                  </p>
                  <p className="text-xs font-semibold">
                    <span className="font-bold">Step 4: </span>Create a
                    screenshot of the page that shows that you have performed
                    the task and upload the screenshot as a proof under Proof of
                    Work Form below. You are also required to enter your social
                    media account username whcih ypu used to perform the task.
                  </p>
                </div>
                <div className="text-orange-400 font-semibold bg-orange-100 rounded text-xs p-3 mt-2">
                  You must{" "}
                  <span className="font-bold text-orange-500">NOT UNDO</span>{" "}
                  any task you perform as it may result to your Gigsflix account
                  getting banned. You will not be able to perform any task if
                  you <span className="font-bold text-orange-500">UNDO</span>{" "}
                  any task performed
                </div>
              </div>

              {status == "pending" || "in-review" ? (
                <div className="mt-2">
                  <p className="font-bold text-xs">Upload Proof of Work:</p>
                  <p className="methodeNote text-red-500 font-bold text-center">
                    {uploadError && uploadError}
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
                      <p className="methodNote">
                        Please enter the username of the social media account
                        you used to perform the task.{" "}
                        <span className="font-bold text-orange-400">
                          ENSURE THE USERNAME IS CORRECT
                        </span>
                        .
                      </p>
                      <h2
                        className="font-bold mb-0"
                        hidden={status !== "in-review"}
                      >
                        Username:{" "}
                        <span className="text-green-500">
                          {taskDetails.proof.username}
                        </span>
                      </h2>
                      <span
                        className="text-xs font-bold text-gray-400"
                        hidden={status !== "in-review"}
                      >
                        Submitted At:{" "}
                        <span className="text-gray-300">
                          {formatDate(taskDetails.proof.createdAt)}
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
              ) : (
                <div></div>
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
