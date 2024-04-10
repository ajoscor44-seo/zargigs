import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import PricingWay from "../components/PricingWay/PricingWay";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import FormInput from "../components/FormInput/FormInput";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";
import allStates from "../data/states";
import religions from "../data/religions";
import axios from "axios";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import waysToCreateEngagementTasks from "../data/waysToCreateEngagementTasks";
// import payWithMonicredit from "../hooks/PayWithMonicredit";

const CreateOrder = () => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [amountToPay, setAmountToPay] = useState(0);
  const [error, setError] = useState(null);
  const params = useParams();
  const slug = params.slug;
  const wayToCreateEngagement = waysToCreateEngagementTasks.find(
    (wayToCreateEngagementTask) => {
      return wayToCreateEngagementTask.pathToPage == "/order/" + slug;
    }
  );

  // Task data object
  const [taskData, setTaskData] = useState({
    taskType: "engagement",
    gender: undefined,
    location: undefined,
    religion: undefined,
    link: undefined,
    numberOfTasks: undefined,
    costPerTask: wayToCreateEngagement.amountToPay,
    taskPlatform: wayToCreateEngagement.platformName.toLowerCase(),
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
      .post("/api/v1/tasks/engagements", taskData)
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
    if (!taskData.link) {
      return setError("Input the link to your profile or page.");
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
          history.push("/order");
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
        pageName={"Engagement on " + wayToCreateEngagement.platformName}
        usePath={true}
        pathToGo={"/order"}
      />
      <div className="underBackNav font-primary mb-28">
        <PricingWay
          way={wayToCreateEngagement}
          wayDescription={wayToCreateEngagement.description}
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
            placeholder={`No. Of ${wayToCreateEngagement.platformName} Engagements`}
            label={`Number of ${wayToCreateEngagement.platformName} Engagements You Want`}
            note={`This is the desired number of ${wayToCreateEngagement.platformName} Engagements you want us to get for you.`}
            errorMsg={"Please input a valid number"}
            isError={false}
            name={"numberOfTasks"}
            handleChange={(e) => {
              setTaskData({
                ...taskData,
                [e.target.name]: e.target.value,
              });
              setAmountToPay(
                Number(e.target.value) *
                  Number(wayToCreateEngagement.amountToPay)
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
            label={
              "Your Social Media Page/Profile Link (e.g Instagram, Twitter or Tiktok Page Link)"
            }
            placeholder={"Enter Your Link"}
            fullRounded={true}
            icon={"link"}
            note={
              "Enter the link to your social media page or profile you want people to follow. Ensure this link points directly to your page or profile and NOT a post."
            }
            errorMsg={"Please input the link to your page"}
            name={"link"}
            handleChange={handleChange}
            isError={false}
          />
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

export default CreateOrder;
