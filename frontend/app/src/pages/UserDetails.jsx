import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import MoneyTransaction from "../components/MoneyTransaction/MoneyTransaction";
import ClientsEarnings from "../components/ClientEarnings/ClientsEarnings";
import numeral from "numeral";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import { IoSettingsOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import ReferAndEarn from "../components/ReferAndEarn/ReferAndEarn";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

const UserDetails = () => {
  const { currentUser } = useAuth();
  const { onlineUsers } = useSocketContext();
  const [userImageURL, setUserImageURL] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  // Updates user profile
  useEffect(() => {
    if (currentUser.image) {
      return setUserImageURL(currentUser.image);
    }
  }, [currentUser]);

  const [show, setShow] = useState(false);
  const totalEarnings = currentUser.totalEarnings;
  const pendingEarnings = currentUser.pendingEarnings;
  const amountWithdrawn = currentUser.amountWithdrawn;
  const amountSpent = currentUser.amountSpent;
  const isOnline = onlineUsers.includes(currentUser.id);
  const badgeColor = isOnline ? "primaryLight" : "slate-300";
  const balance = totalEarnings - amountWithdrawn;
  const userPeoples = {
    referrals: currentUser.referrals.length || 0,
    followers: currentUser?.followers?.length || 0,
    following: currentUser?.followers?.length || 0,
  };
  const state = show ? "block" : "hidden";
  const location = {
    ...currentUser.location,
    country: "Nigeria",
  };
  const referralLink = `https://gigsflix.com/ref/${currentUser.username.toLowerCase()}`;

  return (
    <div>
      <BackNav
        pageName={"User Details"}
        pathToGo={"/"}
        usePath={true}
      />
      <div className="underBackNav mb-20 bg-slate-100">
        <div className="font-primary pt-5 bg-white">
          <Link to="/account-settings">
            <div className="py-2 px-3 transition-colors duration-300 hover:bg-slate-100 rounded-full w-12 h-12 flex justify-center items-center text-primaryLight fixed top-2 z-20 right-2">
              <IoSettingsOutline size={25} />
            </div>
          </Link>
          <div className="flex flex-col border-b pb-3 justify-center items-center">
            <div className="border-2 rounded-md relative">
              <img className="w-32 h-32 object-cover" src={userImageURL} />
              <span
                className={`isOnline w-5 h-5 bg-${badgeColor} rounded-full absolute bottom-3 right-4`}
              ></span>
            </div>
            <div className="p-2 font-primary flex flex-col items-center">
              <h1 className="font-bold text-2xl text-slate-600">
                {currentUser.firstname + " " + currentUser.lastname}
              </h1>
              <span className="font-semibold">
                @{currentUser.username.toLowerCase()}
              </span>
              <Link to="/update-location">
                <div className="flex">
                  <FaLocationDot className="text-primaryLight" />
                  <span className="text-sm">
                    {location.LGA +
                      ", " +
                      location.state +
                      ", " +
                      location.country}
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-end justify-center p-2 gap-5">
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-slate-500 font-semibold text-lg">
                  {userPeoples?.referrals}
                </h2>
                <span className="text-sm">Referrals</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-slate-600 font-semibold text-2xl">
                  {userPeoples?.followers}
                </h2>
                <span className="text-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-slate-500 font-semibold text-lg">
                  {userPeoples?.following}
                </h2>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b bg-white">
          <div className="flex flex-col justify-center items-center font-primary p-2">
            <span className="font-semibold text-lg">Balance:</span>
            <h1 className="font-semibold text-3xl text-primary">
              ₦{numeral(balance).format("0,0.00")}
            </h1>
            <button className="btn" onClick={() => setShow(!show)}>
              {show ? "Show less..." : "Show more..."}
            </button>
          </div>
          <div className={`mx-6 mt-2 ${state}`}>
            <ClientsEarnings
              totalEarnings={totalEarnings}
              pendingEarnings={pendingEarnings}
              amountWithdrawn={amountWithdrawn}
              amountSpent={amountSpent}
            />
          </div>
          <MoneyTransaction />
        </div>

        <ReferAndEarn
          referralLink={referralLink}
          username={currentUser.username}
        />
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default UserDetails;
