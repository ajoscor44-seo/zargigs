import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaTwitter,
  FaYoutube,
  FaTelegram,
  FaRetweet,
  FaShare,
  FaCommentDots,
} from "react-icons/fa6";
import { IoLogoGooglePlaystore, IoLogoAppleAppstore } from "react-icons/io5";
import { SlUserFollowing } from "react-icons/sl";
import { BiLike } from "react-icons/bi";
import { SiAudiomack } from "react-icons/si";
import playStoreImage from "../../assets/images/playstore-icon.png";

const EarnWithTasks = ({ setActiveTab }) => {
  const waysToEarn = [
    {
      title: "Follow People & Pages",
      platformName: "AllFollow",
      amountToEarn: 100,
      pathToPage: "/earn-with-facebook",
      platforms: ["Facebook", "Instagram", "Tiktok"],
      availableTasks: [310],
    },
    {
      title: "Like and Follow Facebook Business Pages",
      platformName: "Facebook",
      amountToEarn: 100,
      pathToPage: "/earn-with-facebook",
      platforms: ["Facebook"],
      availableTasks: [310],
    },
    {
      title: "Like Posts on Social Media",
      platformName: "AllLike",
      amountToEarn: 100,
      pathToPage: "/earn-with-Instagram",
      platforms: ["Facebook", "Instagram", "Twitter", "Tiktok"],
      availableTasks: [120],
    },
    {
      title: "Subscribe on Youtube Channels",
      platformName: "Youtube",
      amountToEarn: 100,
      pathToPage: "/earn-with-twitter",
      platforms: ["Youtube"],
      availableTasks: [20],
    },
    {
      title: "Google Play App Download and Review",
      platformName: "Playstore",
      amountToEarn: 100,
      pathToPage: "/earn-with-tiktok",
      platforms: ["Playstore"],
      availableTasks: [120],
    },
    {
      title: "Download and Review Apps on Apple Store",
      platformName: "Applestore",
      amountToEarn: 100,
      pathToPage: "/earn-with-tiktok",
      platforms: ["Applestore"],
      availableTasks: [120],
    },
    {
      title: "Follow an account on Audiomack",
      platformName: "Audiomack",
      amountToEarn: 100,
      pathToPage: "/earn-with-tiktok",
      platforms: ["Audiomack"],
      availableTasks: [120],
    },
    {
      title: "View, Like and Comment on Youtube",
      platformName: "Youtube",
      amountToEarn: 100,
      pathToPage: "/earn-with-tiktok",
      platforms: ["Youtube"],
      availableTasks: [120],
    },
    {
      title: "Post Comments",
      platformName: "AllComments",
      amountToEarn: 100,
      pathToPage: "/earn-with-tiktok",
      platforms: ["Facebook", "Instagram", "Twitter", "Tiktok"],
      availableTasks: [120],
    },
    {
      title: "Share Posts on Facebook",
      platformName: "AllShare",
      amountToEarn: 100,
      pathToPage: "/earn-with-whatsapp",
      platforms: ["Facebook"],
      availableTasks: [],
    },
    {
      title: "Retweet on Twitter",
      platformName: "AllRetweets",
      amountToEarn: 100,
      pathToPage: "/earn-with-tiktok",
      platforms: ["Twitter"],
      availableTasks: [120],
    },
    {
      title: "Join a Whatsapp Group",
      platformName: "Whatsapp",
      amountToEarn: 100,
      pathToPage: "/earn-with-whatsapp",
      platforms: ["Whatsapp"],
      availableTasks: [10, 10],
    },
    {
      title: "Join a Telegram Group/Channel",
      platformName: "Telegram",
      amountToEarn: 100,
      pathToPage: "/earn-with-whatsapp",
      platforms: ["Telegram"],
      availableTasks: [10, 10, 10],
    },
  ];

  return (
    <div className="py-4">
      <p className="text-xs text-center font-semibold leading-4 px-4">
        Earn steady income by performing simple social and engagement tasks for
        businesses on your social media account.
      </p>

      <p className="text-xs text-center mt-2 px-4 methodNote">
        Do you have up to 1,000 followers? Click{" "}
        <span
          onClick={() => setActiveTab("postAds")}
          className="font-bold text-primary hover:underline"
        >
          here
        </span>{" "}
        to earn from posting adverts on your social media account.
      </p>

      <div className="py-4 flex flex-col gap-2 mb-6">
        {waysToEarn.map((way) => {
          return (
            <div className="hover:bg-slate-50 p-4 flex gap-2">
              <div className="flex flex-col items-center gap-2">
                {way.platformName.toLowerCase() === "facebook" ? (
                  <FaFacebook className="text-blue-600" size={60} />
                ) : way.platformName.toLowerCase() === "instagram" ? (
                  <FaInstagram
                    size={60}
                    className="text-white bg-instagram-gradient rounded"
                  />
                ) : way.platformName.toLowerCase() === "allfollow" ? (
                  <SlUserFollowing
                    size={60}
                    className="text-white bg-blue-400 rounded p-2"
                  />
                ) : way.platformName.toLowerCase() === "tiktok" ? (
                  <FaTiktok
                    size={60}
                    className="text-white bg-black rounded p-1"
                  />
                ) : way.platformName.toLowerCase() === "audiomack" ? (
                  <SiAudiomack
                    size={60}
                    className="text-orange-500 bg-black rounded p-2"
                  />
                ) : way.platformName.toLowerCase() === "applestore" ? (
                  <IoLogoAppleAppstore
                    size={60}
                    className="text-blue-500 bg-white rounded-full"
                  />
                ) : way.platformName.toLowerCase() === "playstore" ? (
                  <img
                    src={playStoreImage}
                    className="w-20 h-20 object-cover"
                  />
                ) : way.platformName.toLowerCase() === "allretweets" ? (
                  <FaRetweet
                    size={60}
                    className="text-blue-500 bg-white rounded-full"
                  />
                ) : way.platformName.toLowerCase() === "allshare" ? (
                  <FaShare
                    size={60}
                    className="text-white bg-white rounded-full bg-instagram-gradient p-3"
                  />
                ) : way.platformName.toLowerCase() === "allcomments" ? (
                  <FaCommentDots
                    size={60}
                    className="text-green-400 bg-white"
                  />
                ) : way.platformName.toLowerCase() === "telegram" ? (
                  <FaTelegram size={60} className="text-blue-400 bg-white" />
                ) : way.platformName.toLowerCase() === "alllike" ? (
                  <BiLike
                    size={60}
                    className="text-white bg-blue-500 rounded-full p-2"
                  />
                ) : way.platformName.toLowerCase() === "youtube" ? (
                  <FaYoutube size={60} className="text-red-500" />
                ) : way.platformName.toLowerCase() === "whatsapp" ? (
                  <FaWhatsapp
                    size={60}
                    className="bg-green-500 text-white rounded p-1"
                  />
                ) : (
                  <FaTwitter className="text-blue-400" size={60} />
                )}

                <button className="btn border">SELECT</button>
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-1 border-b pb-1">
                  <h1 className="text-md font-extrabold">{way.title}</h1>
                  <span className="text-xs">
                    Earnings:{" "}
                    <span className="font-bold">
                      ₦{way.amountToEarn} per Advert Post
                    </span>
                  </span>
                </div>
                <div>
                  <p className="font-semibold leading-4 mt-2 methodNote">
                    Post adverts of various businesses and top brands on your{" "}
                    {way.platformName} Page and earn N100 per advert post. The
                    more you post, the more you earn. Note that your Facebook
                    account must have atleast 1000 Active Friends or Followers
                    to be eligible for this task.
                  </p>
                  <div className="methodNote font-extrabold mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Platforms: </span>
                      <span className="flex items-center gap-1">
                        {way.platforms.map((platform) =>
                          platform.toLowerCase() === "facebook" ? (
                            <FaFacebook className="text-blue-600" size={15} />
                          ) : platform.toLowerCase() === "instagram" ? (
                            <FaInstagram
                              size={15}
                              className="text-white bg-instagram-gradient rounded"
                            />
                          ) : platform.toLowerCase() === "whatsapp" ? (
                            <FaWhatsapp
                              size={15}
                              className="text-green-500 rounded"
                            />
                          ) : platform.toLowerCase() === "tiktok" ? (
                            <FaTiktok
                              size={15}
                              className="text-white bg-black rounded p-1"
                            />
                          ) : platform.toLowerCase() === "audiomack" ? (
                            <SiAudiomack
                              size={15}
                              className="text-orange-500 bg-black rounded"
                            />
                          ) : platform.toLowerCase() === "applestore" ? (
                            <IoLogoAppleAppstore
                              size={15}
                              className="text-blue-500 bg-white rounded-full"
                            />
                          ) : platform.toLowerCase() === "playstore" ? (
                            <img
                              src={playStoreImage}
                              className="w-5 h-5 object-cover"
                            />
                          ) : platform.toLowerCase() === "youtube" ? (
                            <FaYoutube size={15} className="text-red-500" />
                          ) : platform.toLowerCase() === "telegram" ? (
                            <FaTelegram
                              size={15}
                              className="text-blue-400 bg-white"
                            />
                          ) : (
                            <FaTwitter className="text-blue-400" size={15} />
                          )
                        )}
                      </span>
                    </div>

                    {way.availableTasks.length ? (
                      <div className="bg-green-500 px-1 rounded text-white">
                        {way.availableTasks.length} Tasks Available
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarnWithTasks;
