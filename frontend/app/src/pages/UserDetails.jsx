import React, { useEffect, useState } from "react";
import BackNav from "../components/BackNav/BackNav";
import MoneyTransaction from "../components/MoneyTransaction/MoneyTransaction";
import ClientsEarnings from "../components/ClientEarnings/ClientsEarnings";
import numeral from "numeral";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import { FaLocationDot, FaSpinner } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom";
import ReferAndEarn from "../components/ReferAndEarn/ReferAndEarn";
import { useAuth } from "../context/AuthContext";

const UserDetails = () => {
  const { currentUser } = useAuth();
  const [modalData, setModalData] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [modalTitle, setModalTitle] = useState("Referrals");
  const totalEarnings = currentUser.userEarnings.totalEarnings;
  const pendingEarnings = currentUser.userEarnings.pendingEarnings;
  const amountWithdrawn = currentUser.userEarnings.amountWithdrawn;
  const amountSpent = currentUser.userEarnings.amountSpent;
  const balance = currentUser.userEarnings.balance;
  const referrals = currentUser?.referrals;
  const followers = currentUser?.referrals?.filter(
    (referral) => referral.isMember
  );
  const userPeoples = {
    referrals: referrals?.length || 0,
    followers: followers?.length || 0,
    following: 1,
  };
  const state = show ? "block" : "hidden";
  const location = {
    ...currentUser.location,
    country: "Nigeria",
  };

  const showModal = (data) => {
    try {
      setModalData(data);
      setModalState(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <BackNav pageName={"User Details"} pathToGo={"/"} usePath={true} />
      <div className="underBackNav mb-20 bg-slate-100">
        <div className="font-primary pt-5 bg-white">
          <Link to="/account-settings">
            <div className="py-2 px-3 transition-colors duration-300 hover:bg-slate-100 rounded-full w-12 h-12 flex justify-center items-center text-green-500 fixed top-2 z-20 right-2">
              <IoSettingsOutline size={25} />
            </div>
          </Link>
          <div className="flex flex-col border-b pb-3 justify-center items-center">
            <div className="border-2 rounded-md relative">
              <img className="w-32 h-32 object-cover" src={userImageURL} />
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
                  <FaLocationDot className="text-green-500" />
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
              <div
                onClick={() => {
                  showModal(referrals);
                  setModalTitle("Referrals");
                }}
                className="flex flex-col items-center justify-center"
              >
                <h2 className="text-slate-500 font-semibold text-lg">
                  {userPeoples?.referrals}
                </h2>
                <span className="text-sm">Referrals</span>
              </div>
              <div
                onClick={() => {
                  showModal(followers);
                  setModalTitle("Followers");
                }}
                className="flex flex-col items-center justify-center"
              >
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

        <ReferAndEarn username={currentUser.username} />
      </div>
      <div
        className={`bg-dark modal_bg ${
          modalState ? "" : "hidden"
        } fixed top-0 left-0 min-h-screen w-screen flex justify-center items-center`}
      >
        <div className="flex flex-col bg-white items-center justify-center p-3 rounded">
          <div
            className="flex items-center gap-10 justify-between w-full"
            style={{ maxWidth: "400px" }}
          >
            <h1 className="font-bold italic">{modalTitle}</h1>
            <span
              onClick={() => setModalState(false)}
              className="cursor-pointer border-2 border-white hover:border-gray-200"
            >
              <IoClose size={25} color="red" />
            </span>
          </div>
          {loading ? (
            <div>
              <FaSpinner size={25} color="green" />
            </div>
          ) : modalData.length ? (
            <div className="flex flex-col gap-1">
              {modalData.map((item, i) => {
                return (
                  <div
                    className="flex items-start border rounded-sm max-h-96 overflow-y-auto"
                    key={i}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <img
                        className="w-12 h-12 rounded-full"
                        src={item.image || userImageURL}
                        alt="User Profile Pic"
                      />
                    </div>
                    <div>
                      <h1>{item.firstname + " " + item.lastname}</h1>
                      <h2>@{item.username}</h2>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <p>No Data Available</p>
            </div>
          )}
        </div>
      </div>
      <ClientMenuBar />
    </div>
  );
};

export default UserDetails;
