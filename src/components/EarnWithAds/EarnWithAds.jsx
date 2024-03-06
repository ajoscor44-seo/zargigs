import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaTwitter,
} from "react-icons/fa6";

const EarnWithAds = ({ setActiveTab }) => {
  const waysToEarn = [
    {
      platformName: "Facebook",
      amountToEarn: 100,
      pathToPage: "/earn-with-facebook",
      platforms: ["Facebook"],
    },
    {
      platformName: "Instagram",
      amountToEarn: 100,
      pathToPage: "/earn-with-Instagram",
      platforms: ["Instagram"],
    },
    {
      platformName: "Twitter",
      amountToEarn: 100,
      pathToPage: "/earn-with-twitter",
      platforms: ["Twitter"],
    },
    {
      platformName: "Tiktok",
      amountToEarn: 100,
      pathToPage: "/earn-with-tiktok",
      platforms: ["Tiktok"],
    },
    {
      platformName: "WhatsApp",
      amountToEarn: 100,
      pathToPage: "/earn-with-whatsapp",
      platforms: ["WhatsApp"],
    },
  ];

  return (
    <div className="py-4">
      <p className="text-xs text-center font-semibold leading-4 px-4">
        Earn steady income by posting adverts of businesses and top brands on
        your social media page. To post adverts on Facebook, Instagram, Twitter
        or Tiktok, you MUST have atleast{" "}
        <span className="font-extrabold">1,000 Followers</span> on your social
        media account.
      </p>

      <p className="text-xs text-center mt-2 px-4 methodNote">
        Don't have up to 1,000 followers? Click{" "}
        <span
          onClick={() => setActiveTab("doTasks")}
          className="font-bold text-primary hover:underline"
        >
          here
        </span>{" "}
        to perform engagement tasks
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
                ) : way.platformName.toLowerCase() === "tiktok" ? (
                  <FaTiktok
                    size={60}
                    className="text-white bg-black rounded p-1"
                  />
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
                  <h1 className="text-md font-extrabold">
                    Post Adverts on {way.platformName}
                  </h1>
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
                  <div className="methodNote font-extrabold mt-1 flex items-center gap-2">
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
                        ) : (
                          <FaTwitter className="text-blue-400" size={15} />
                        )
                      )}
                    </span>
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

export default EarnWithAds;
