import React, { useRef, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import PricingWay from "../components/PricingWay/PricingWay";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import FormInput from "../components/FormInput/FormInput";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";
import { FcAddImage } from "react-icons/fc";
import { FaVideo } from "react-icons/fa6";
import allStates from "../data/states";
import religions from "../data/religions";
import axios from "axios";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase.config";
import { useAuth } from "../context/AuthContext";

const CreateAdvert = () => {
  const { advertCreator } = useAuth();
  const fileInputRef = useRef();
  const [toastNotifications, setToastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMediaUploadTab, setActiveMediaUploadTab] = useState("photo");
  const [amountToPay, setAmountToPay] = useState(0);
  const [error, setError] = useState(null);
  const params = useParams();
  const slug = params.slug;
  const wayToCreateAdvert = advertCreator?.find((wayToCreateAdvertTasks) => {
    return wayToCreateAdvertTasks.pathToPage == "/advertise/" + slug;
  });
  const [mediaError, setMediaError] = useState(null);
  const [mediaPercentage, setMediaPercentage] = useState(null);
  const statesName = allStates.map((state) => state.name);

  // Task data object
  const [taskData, setTaskData] = useState({
    title: wayToCreateAdvert?.title,
    taskType: "advert",
    gender: undefined,
    location: undefined,
    religion: undefined,
    caption: undefined,
    mediaUrl: undefined,
    numberOfTasks: undefined,
    payId: wayToCreateAdvert?.id,
    earnId: wayToCreateAdvert?.earnId,
    taskPlatform: wayToCreateAdvert?.platformName.toLowerCase(),
  });

  // Toast Notification
  const showToast = (notificationObj) => {
    setToastNotifications([...toastNotifications, notificationObj]);

    const toastTimeout = setTimeout(() => {
      setToastNotifications([]);
      clearTimeout(toastTimeout);
    }, 3100);
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  // Processess payment and checks its validity
  const processPayment = async () => {
    const response = await axios.get(
      `/api/v1/tasks/process-payment?amount=${amountToPay}&type=advert`
    );

    return response.data;
  };

  // Adds new task
  const addNewtask = async (taskData) => {
    return await axios
      .post("/api/v1/tasks/adverts", taskData)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  // Creates New Task
  const createNewtask = async () => {
    if (!taskData.numberOfTasks) {
      return setError("Input A valid Number of Adverts.");
    }
    if (!taskData.gender || taskData.gender == "Select Gender") {
      return setError("Select A Gender.");
    }
    if (!taskData.location) {
      return setError("Select A Location.");
    }
    if (!taskData.religion) {
      return setError("Select A Religion.");
    }
    if (!taskData.caption) {
      return setError("Input A Caption.");
    }
    if (!taskData.mediaUrl) {
      return alert("Are you sure you don't want to upload an advert media.");
    }
    setError(null);
    setLoading(true);
    const paymentProcessed = await processPayment();

    if (paymentProcessed.status) {
      const res = await addNewtask(taskData);

      if (!res.failed) {
        showToast({
          msg: `${res.message}`,
          errorType: "success",
        });

        const toastTimeout = setTimeout(() => {
          setToastNotifications([]);
          window.location.href = "/advertise";
          clearTimeout(toastTimeout);
        }, 3100);
        return setLoading(false);
      }
      showToast({
        msg: `${res.message}`,
        errorType: "danger",
      });
      return setLoading(false);
    }

    showToast({
      msg: `${paymentProcessed.message}`,
      errorType: "danger",
    });
    return setLoading(false);
  };

  // Selects Profile Picture
  const selectMedia = () => {
    return fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file chosen.");
      return;
    }

    if (file.type.startsWith("image") && file.size > 2097152) {
      // 2 MB for images
      alert("The photo is too large. Maximum size is 2 MB.");
      return (e.target.value = ""); // Reset the input
    } else if (file.type.startsWith("video") && file.size > 15728640) {
      // 100 MB for videos
      alert(
        "The video is too large. Maximum size for a video is approximately 15MB."
      );
      return (e.target.value = ""); // Reset the input
    } else {
      alert("File is accepted.");
      // Handle the file upload process here
      return uploadMedia(file);
    }
  };

  const uploadMedia = (image) => {
    try {
      setMediaPercentage(null);
      setMediaError(null);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(
        storage,
        "advert/" + activeMediaUploadTab + "/" + fileName
      );
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Returns the progress of the image
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setMediaPercentage(progress);
        },
        (error) => {
          setMediaPercentage(null);
          return setMediaError(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setTaskData({
              ...taskData,
              mediaUrl: downloadUrl,
            });
            setMediaError(null);
            setMediaPercentage(null);
          });
        }
      );
      return;
    } catch (error) {
      showToast({
        msg: "File is too large",
        errorType: "danger",
      });
    }
  };

  return (
    <div>
      <BackNav
        pageName={"Post Advert on " + wayToCreateAdvert?.platformName}
        usePath={true}
        pathToGo={"/advertise"}
      />
      <div className="underBackNav font-primary mb-28">
        <PricingWay
          way={wayToCreateAdvert}
          wayDescription={wayToCreateAdvert?.description}
        />
        {error && (
          <p className="fixed top-12 z-10 w-full text-center bg-red-200 text-red-500 rounded py-1 font-semibold">
            {error}
          </p>
        )}
        <div className="p-4 border-t flex flex-col gap-3">
          <FormInput
            type={"number"}
            fullRounded={true}
            placeholder={`No. Of ${wayToCreateAdvert?.platformName} Advert Posts`}
            label={`Number of ${wayToCreateAdvert?.platformName} Advert Posts You Want`}
            note={`This is the desired Number of ${wayToCreateAdvert?.platformName} Advert Posts you want us to get for you.`}
            errorMsg={"Please input a valid number"}
            isError={false}
            name={"numberOfTasks"}
            handleChange={(e) => {
              setTaskData({
                ...taskData,
                [e.target.name]: e.target.value,
              });
              setAmountToPay(
                Number(e.target.value) * Number(wayToCreateAdvert?.amountToPay)
              );
            }}
          />
          <FormInput
            label={"Select Gender"}
            placeholder={"Select Gender"}
            useSelect={true}
            selections={[
              "Select Gender",
              "All Genders",
              "Male",
              "Female",
              "Transgender",
              "Custom",
              "Others",
            ]}
            note={
              "You can select the kind of gender whether male or female that you want to see your task. For example, if you are selling women fashion items, you can select the Female gender so your task will be shown to only females. Select 'All Gender' if you want to target all genders"
            }
            errorMsg={"Please select a gender category"}
            handleChange={handleChange}
            name={"gender"}
            isError={false}
          />
          <FormInput
            label={"Select Location"}
            placeholder={"Select Location"}
            useSelect={true}
            selections={["Select Location", "All Nigeria", ...statesName]}
            note={
              "You can target and select a particular location where your task or advert will be mostly shown. Select 'All Nigeria' if you want to target every location in Nigeria"
            }
            errorMsg={"Please select a location"}
            name={"location"}
            handleChange={handleChange}
            isError={false}
          />
          <FormInput
            label={"Select Religion"}
            placeholder={"Select Religion"}
            useSelect={true}
            selections={["Select Religion", "All Religions", ...religions]}
            note={
              "You can target people of a particular religion or belief. Your advert and task will be shown to the particular religion you select. Select 'All Religion' if you want to target all religion."
            }
            errorMsg={"Please select a religion"}
            name={"religion"}
            handleChange={handleChange}
            isError={false}
          />
          <FormInput
            label={"Enter Advert Text or Caption"}
            placeholder={""}
            useTextArea={true}
            note={
              "Please enter the advert text or caption. The advert text or caption should be well detailed. You can also include a link to your site, a phone number for people to contact you or any information you want people to see on your advert."
            }
            errorMsg={"Please select a religion"}
            name={"caption"}
            handleChange={handleChange}
            isError={false}
          />
        </div>

        <div className="px-4 pb-6">
          <h2 className="text-xs font-semibold mb-2">
            Choose{" "}
            <span className={"uppercase font-semibold text-orange-500"}>
              one
            </span>{" "}
            of the Advert Media Upload Below:
          </h2>
          <div className="flex" hidden={taskData.mediaUrl}>
            <div
              className={
                "uploadAdvertMediaTab " +
                (activeMediaUploadTab === "photo" && "active")
              }
              onClick={() => {
                if (!taskData?.mediaUrl) {
                  setActiveMediaUploadTab("photo");
                }
              }}
            >
              Upload Photo Advert
            </div>
            <div
              className={
                "uploadAdvertMediaTab " +
                (activeMediaUploadTab === "video" && "active")
              }
              onClick={() => {
                if (!taskData?.mediaUrl) {
                  setActiveMediaUploadTab("video");
                }
              }}
            >
              Upload Video Advert
            </div>
          </div>
          <p className="methodNote leading-1 mt-2">
            Upload a {activeMediaUploadTab.toUpperCase()} of the Advert You want
            people to post on their social media post accounts like Whatsapp,
            Facebook, Instagram, Twitter, Tiktok etc.
          </p>
          {mediaError ? (
            <p className="text-center text-sm">{mediaError}</p>
          ) : (
            <p className="text-center text-sm">{mediaPercentage}</p>
          )}
          <div
            onClick={selectMedia}
            className="flex flex-col items-center bg-gray-100 mx-3 rounded-sm mt-2 cursor-pointer border overflow-hidden"
            style={{ maxHeight: "200px" }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*,video/*"
              style={{ display: "none" }}
            />

            <div className="max-w-full max-h-full">
              {activeMediaUploadTab == "photo" ? (
                <div>
                  {taskData.mediaUrl ? (
                    <img
                      className="object-cover"
                      src={taskData.mediaUrl}
                      style={{ maxHeight: "200px" }}
                    />
                  ) : (
                    <FcAddImage className="mt-10" size={30} />
                  )}
                </div>
              ) : (
                <div>
                  {taskData.mediaUrl ? (
                    <iframe
                      src={taskData.mediaUrl}
                      width={"100%"}
                      height={"150px"}
                    ></iframe>
                  ) : (
                    <FaVideo className="text-gray-600 mt-10" size={30} />
                  )}
                </div>
              )}
            </div>
            {taskData.mediaUrl ? (
              <span></span>
            ) : (
              <span className="capitalize text-xs font-semibold mt-1 mb-10">
                Upload {activeMediaUploadTab}
              </span>
            )}
          </div>
        </div>
      </div>

      <PayAmountBar
        feeTitle={"You will pay"}
        fee={amountToPay}
        btnText={"Submit and Make Payment"}
        handleClick={createNewtask}
        disable={loading}
      />
      <ClientMenuBar />
      <div className="toast_cover">
        {toastNotifications?.map((toastNotification) => {
          return (
            <ToastNotification
              key={toastNotification.id}
              toastNotification={toastNotification}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CreateAdvert;
