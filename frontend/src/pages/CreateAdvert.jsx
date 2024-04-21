import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import waysToCreateAdvertTasks from "../data/waysToCreateAdvertsTasks";
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
// import payWithMonicredit from "../hooks/PayWithMonicredit";

const CreateAdvert = () => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [activeMediaUploadTab, setActiveMediaUploadTab] = useState("photo");
  const [amountToPay, setAmountToPay] = useState(0);
  const [error, setError] = useState(null);
  const params = useParams();
  const slug = params.slug;
  const wayToCreateAdvert = waysToCreateAdvertTasks.find(
    (wayToCreateAdvertTasks) => {
      return wayToCreateAdvertTasks.pathToPage == "/advertise/" + slug;
    }
  );

  // Task data object
  const [taskData, setTaskData] = useState({
    title: wayToCreateAdvert.title,
    taskType: "advert",
    gender: undefined,
    location: undefined,
    religion: undefined,
    caption: undefined,
    mediaUrl: undefined,
    numberOfTasks: undefined,
    costPerTask: wayToCreateAdvert.amountToPay,
    taskPlatform: wayToCreateAdvert.platformName.toLowerCase(),
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

  // Processess payment
  const processPayment = async () => {
    // Initiate Payment
    // const paymentStatus = await payWithMonicredit();
    // Verify Payment
    // return paymentStatus;
    return true;
  };

  // Adds new task
  const addNewtask = async (taskData) => {
    return await axios
      .post("/api/v1/tasks/adverts", taskData)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
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
    setError(null);
    setLoading(true);
    const paymentProcessed = await processPayment();

    if (paymentProcessed) {
      const res = await addNewtask(taskData);

      if (!res.failed) {
        showToast({
          msg: `${res.message}`,
          errorType: "success",
        });

        const toastTimeout = setTimeout(() => {
          setToastNotifications([]);
          history.push("/advertise");
          clearTimeout(toastTimeout);
        }, 2500);
        return setLoading(false);
      }
      setLoading(false);
      return showToast({
        msg: `${res.message}`,
        errorType: "danger",
      });
    }
    return;
  };

  return (
    <div>
      <BackNav
        pageName={"Post Advert on " + wayToCreateAdvert.platformName}
        usePath={true}
        pathToGo={"/advertise"}
      />
      <div className="underBackNav font-primary mb-28">
        <PricingWay
          way={wayToCreateAdvert}
          wayDescription={wayToCreateAdvert.description}
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
            placeholder={`No. Of ${wayToCreateAdvert.platformName} Advert Posts`}
            label={`Number of ${wayToCreateAdvert.platformName} Advert Posts You Want`}
            note={`This is the desired Number of ${wayToCreateAdvert.platformName} Advert Posts you want us to get for you.`}
            errorMsg={"Please input a valid number"}
            isError={false}
            name={"numberOfTasks"}
            handleChange={(e) => {
              setTaskData({
                ...taskData,
                [e.target.name]: e.target.value,
              });
              setAmountToPay(
                Number(e.target.value) * Number(wayToCreateAdvert.amountToPay)
              );
            }}
          />
          <FormInput
            label={"Select Gender"}
            placeholder={"Select Gender"}
            useSelect={true}
            selections={[
              "Select Gender",
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
            selections={["Select Location", "All Nigeria", ...allStates]}
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
            Choose one of the Advert Media Upload Below:
          </h2>
          <div className="flex">
            <div
              className={
                "uploadAdvertMediaTab " +
                (activeMediaUploadTab === "photo" && "active")
              }
              onClick={() => setActiveMediaUploadTab("photo")}
            >
              Upload Photo Advert
            </div>
            <div
              className={
                "uploadAdvertMediaTab " +
                (activeMediaUploadTab === "video" && "active")
              }
              onClick={() => setActiveMediaUploadTab("video")}
            >
              Upload Video Advert
            </div>
          </div>
          <p className="methodNote leading-1 mt-2">
            Upload a {activeMediaUploadTab.toUpperCase()} of the Advert You want
            people to post on their social media post accounts like Whatsapp,
            Facebook, Instagram, Twitter, Tiktok etc.
          </p>
          <div className="flex flex-col items-center bg-gray-100 py-10 mx-3 rounded-sm mt-2 cursor-pointer border">
            <div>
              {activeMediaUploadTab == "photo" ? (
                <FcAddImage size={30} />
              ) : (
                <FaVideo className="text-gray-600" size={30} />
              )}
            </div>
            <span className="capitalize text-xs font-semibold mt-1">
              Upload {activeMediaUploadTab}
            </span>
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
