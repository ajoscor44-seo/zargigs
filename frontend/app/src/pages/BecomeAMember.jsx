import React, { useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import numeral from "numeral";
import { Link } from "react-router-dom/cjs/react-router-dom";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ToastNotification from "../components/ToastNotification/ToastNotification";
import { FaWallet } from "react-icons/fa6";

const BecomeAMember = () => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const { adminData, logoutUser } = useAuth();
  const [disableBtn, setDisableBtn] = useState(false);

  // Toast Notification
  const showToast = (notificationObj) => {
    setToastNotifications([...toastNotifications, notificationObj]);

    const toastTimeout = setTimeout(() => {
      setToastNotifications([]);
      clearTimeout(toastTimeout);
    }, 3100);
  };

  const becomeAMember = async () => {
    try {
      setDisableBtn(true);
      await axios.put("/api/v1/user/become-a-member");
      await logoutUser();
      window.location.href = "/login";
    } catch (error) {
      showToast({
        msg: `${error.response.data.message}`,
        errorType: "danger",
      });
      return setDisableBtn(false);
    }
  };
  return (
    <div className="flex fullHeight">
      <BackNav pageName={"Perform Social Tasks And Earn"} />
      <Link to="/fund-wallet">
        <FaWallet
          size={28}
          className="z-40 fixed right-4 top-4 cursor-pointer text-green-500"
        />
      </Link>
      <div className="underBackNav flex flex-col flex-1 font-primary bg-white mt-3 highBase">
        <span className="text-center text-xs mb-1">Become a Member Today</span>
        <h2 className="font-bold text-2xl px-2 text-center">
          Turn Your Social Media Accounts into a Money Making Machine!
        </h2>
        <p className="text-xs leading-5 font-semibold py-2 px-4">
          Do you know you can earn daily income by performing social media tasks
          such as likes, follows, comments, shares, retweets etc. That is one of
          the many benefits of becoming a member on {adminData?.appName}.
        </p>
        <div>
          <h3 className="text-xs mb-5 mt-3 px-4 leading-5">
            When you activate your account with a one-time membership fee of ₦
            {numeral(adminData?.membershipFee).format("0,0")}, you get lifetime
            access to enjoy the following benefits:
          </h3>
          <ul className="list-disc pl-12 pr-4">
            <li className="text-xs font-semibold leading-5 mb-5">
              <span className="font-extrabold">Earn steady daily figures</span>{" "}
              by following, liking, commenting, sharing, retweeting or posting
              adverts for businesses on your social media. Click{" "}
              <Link to="/earn">
                <span className="text-green-500 hover:underline">here </span>
              </Link>
              to see what you will earn when you perform social tasks
            </li>
            <li className="text-xs font-semibold leading-5 mb-5">
              <span className="font-extrabold">
                Earn an Instant Referral Commission of ₦
                {numeral(adminData.membershipFee * 0.6).format("0,0")}
              </span>{" "}
              when you refer someone to become a member on {adminData?.appName}.
              The more you refer, the more you earn. Click{" "}
              <span className="text-green-500 hover:underline">here</span> to
              learn how referral works.
            </li>
            <li className="text-xs font-semibold leading-5 mb-5">
              <span className="font-extrabold">
                Earn Social Boost Referral Commission of 60% of any amount paid
              </span>{" "}
              when you refer someone to Buy Likes, Followers, Comments, Shares,
              Whatsapp Post Views etc. Click{" "}
              <span className="text-green-500 hover:underline">here</span> to
              learn how referral works.
            </li>
          </ul>
          <h3 className="text-xs px-4 mb-4">
            ...and so much more benefits for you!
          </h3>

          <p className="px-4 text-xs">
            What are you waiting for? Click the button below to make payments
            and activate your membership.
          </p>
        </div>
        <PayAmountBar
          feeTitle={"Membership Fee"}
          fee={adminData?.membershipFee}
          btnText={"Click Here To Pay Now"}
          handleClick={becomeAMember}
          disable={disableBtn}
        />
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
      <ClientMenuBar />
    </div>
  );
};

export default BecomeAMember;
