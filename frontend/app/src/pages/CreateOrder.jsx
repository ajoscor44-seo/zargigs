import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import PricingWay from "../components/PricingWay/PricingWay";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import FormInput from "../components/FormInput/FormInput";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";
import allStates from "../data/states";
import religions from "../data/religions";
import axios from "axios";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import { useAuth } from "../context/AuthContext";

const CreateOrder = () => {
  const { engagementCreator } = useAuth();
  const [toastNotifications, setToastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amountToPay, setAmountToPay] = useState(0);
  const [error, setError] = useState(null);
  const params = useParams();
  const slug = params.slug;
  const wayToCreateEngagement = engagementCreator.find(
    (wayToCreateEngagementTask) => {
      return wayToCreateEngagementTask.pathToPage == "/order/" + slug;
    }
  );
  const statesName = allStates.map((state) => state.name);

  // Task data object
  const [taskData, setTaskData] = useState({
    title: wayToCreateEngagement.title,
    taskType: "engagement",
    gender: undefined,
    location: undefined,
    religion: undefined,
    link: undefined,
    numberOfTasks: undefined,
    payId: wayToCreateEngagement.id,
    earnId: wayToCreateEngagement.earnId,
    customComment: undefined,
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

  // Adds new task
  const addNewtask = async (taskData) => {
    return await axios
      .post("/api/v1/tasks/engagements", taskData)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        setLoading(false);
        return error.response.data;
      });
  };

  // Creates New Task
  const createNewtask = async () => {
    try {
      if (!taskData.numberOfTasks) {
        return setError("Input A valid Number of Engagements.");
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
      const tasksProcessed = await addNewtask(taskData);

      if (tasksProcessed.status) {
        if (!tasksProcessed.failed) {
          showToast({
            msg: `${tasksProcessed.message}`,
            errorType: "success",
          });

          const toastTimeout = setTimeout(() => {
            setToastNotifications([]);
            window.location.href = "/order";
            clearTimeout(toastTimeout);
          }, 2500);
          return setLoading(false);
        }
        showToast({
          msg: `${tasksProcessed.message}`,
          errorType: "danger",
        });
        return setLoading(false);
      }
      showToast({
        msg: `${tasksProcessed.message}`,
        errorType: "danger",
      });
      return setLoading(false);
    } catch (error) {
      showToast({
        msg: `${error.response.data.message}`,
        errorType: "danger",
      });
      return setLoading(false);
    }
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
            fullRounded
            placeholder={`No. Of ${wayToCreateEngagement.platformName} Engagements`}
            label={`Number of ${wayToCreateEngagement.platformName} Engagements You Want`}
            note={`This is the desired number of ${wayToCreateEngagement.platformName} Engagements you want us to get for you.`}
            errorMsg={"Please input a valid number"}
            name={"numberOfTasks"}
            handleChange={(e) => {
              handleChange(e);
              return setAmountToPay(
                Number(e.target.value) *
                  Number(wayToCreateEngagement.amountToPay)
              );
            }}
          />
          {wayToCreateEngagement.platformName.toLowerCase() ===
          "allcomments" ? (
            <FormInput
              type={"text"}
              fullRounded
              useTextArea
              placeholder={`Custom comment you want to see on your post`}
              label={"Custom comment you want people to say on your post"}
              note={
                "This is the custom comment you want people to say on your post."
              }
              errorMsg={"Please input a meaningful comment"}
              name={"customComment"}
              handleChange={handleChange}
            />
          ) : (
            <div></div>
          )}
          <FormInput
            label={"Select Gender"}
            placeholder={"Select Gender"}
            useSelect
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
          />
          <FormInput
            label={"Select Location"}
            placeholder={"Select Location"}
            useSelect
            selections={["Select Location", "All Nigeria", ...statesName]}
            note={
              "You can target and select a particular location where your task or advert will be mostly shown. Select 'All Nigeria' if you want to target every location in Nigeria"
            }
            errorMsg={"Please select a location"}
            name={"location"}
            handleChange={handleChange}
          />
          <FormInput
            label={"Select Religion"}
            placeholder={"Select Religion"}
            useSelect
            selections={["Select Religion", "All Religions", ...religions]}
            note={
              "You can target people of a particular religion or belief. Your advert and task will be shown to the particular religion you select. Select 'All Religion' if you want to target all religion."
            }
            errorMsg={"Please select a religion"}
            name={"religion"}
            handleChange={handleChange}
          />
          <FormInput
            label={
              "Your Page/Profile Link (e.g Instagram, Twitter, Website or Tiktok Page Link)"
            }
            placeholder={"Enter Your Link"}
            fullRounded
            icon={"link"}
            note={
              "Enter the link to your page or profile you want people to engage. Ensure this link points directly to your page or profile and NOT a post."
            }
            errorMsg={"Please input the link to your page"}
            name={"link"}
            handleChange={handleChange}
          />
          <FormInput
            label={"Describe The Task (Optional)"}
            placeholder={"Enter A Description"}
            note={
              "Describe the task you want people to perform on your page or profile. Ensure this description describes the type of task you selected."
            }
            useTextArea
            errorMsg={"Please input the link to your page"}
            name={"description"}
            handleChange={handleChange}
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
        {toastNotifications?.map((toastNotification, i) => {
          return (
            <ToastNotification key={i} toastNotification={toastNotification} />
          );
        })}
      </div>
    </div>
  );
};

export default CreateOrder;
