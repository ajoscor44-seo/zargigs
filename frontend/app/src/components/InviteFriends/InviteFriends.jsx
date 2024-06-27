import React, { useRef, useState } from "react";
import BackNav from "../BackNav/BackNav";
import { BsCopy } from "react-icons/bs";
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa6";
import userPic from "../../assets/images/user-image.png";
import CopyToClipboard from "../../hooks/CopyToClipboard";
import { useAuth } from "../../context/AuthContext";

const InviteFriends = () => {
  const { currentUser } = useAuth();
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;
  const { adminData } = useAuth();
  const message = `Introducing ${adminData?.appName}: Where Engagement Meets Earning and Growth! Dive into a platform that not only rewards you for social tasks like liking, sharing, and commenting but also elevates your social media presence. Ideal for those looking to amplify their digital influence or businesses aiming to extend their reach. 

At ${adminData?.appName}, your everyday social interactions have value. Beyond earning rewards, users with over 1,000 followers unlock the potential to advertise for others, turning their social media prowess into profit. It's a dual advantage—grow your following and monetize your influence effortlessly. 
    
For businesses and individuals looking to advertise, ${adminData?.appName} offers a unique opportunity. Leverage our community of engaged social media users to boost your products or services. It's simple, efficient, and effective, ensuring your brand reaches the audience it deserves. 
    
Why join ${adminData?.appName}? It's more than just a platform; it's a community where engagement translates into rewards, growth, and visibility. Whether you're here to enhance your social media presence, earn from advertising, or promote your products, ${adminData?.appName} is your go-to destination. 
    
To get started, simply visit ${app_url}/ref/${currentUser.username} to register on the app. You will thank me later.`;
  const briefMessage = `Discover ${adminData?.appName}, a dynamic platform that rewards social media engagement and boosts your online presence. Perfect for influencers and businesses, ${adminData?.appName} offers a unique chance to earn by liking, sharing, and commenting, or even advertising if you have over 1,000 followers. Join our community to grow your influence, advertise efficiently, and enhance your brand's reach. Start your rewarding journey at ${adminData?.appName} by registering at ${app_url}/ref/${currentUser.username}.`;
  const messageRef = useRef(null);

  const copyToClipboard = (messageRef) => {
    const textIsCopied = CopyToClipboard(messageRef);

    alert("Copied: " + textIsCopied);
    messageRef.current.style.display = "block";
  };

  const encodedText = encodeURIComponent(message);
  const encodedBriefText = encodeURIComponent(briefMessage);
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterLink = `https://twitter.com/share?text=${encodedBriefText}`;
  const linkedInLink = `https://www.linkedin.com/sharing/share-offsite/?text=${encodedBriefText}`;

  return (
    <div className="relative">
      <BackNav
        pageName={"Invite Friends"}
        usePath={true}
        pathToGo={"/user-details"}
      />
      <button
        onClick={() => copyToClipboard(messageRef)}
        className="absolute z-20 flex right-3 top-4 items-center gap-2 px-2 py-1 rounded-full text-white bg-green-500"
      >
        <span className="font-semibold text-sm">Copy Message</span>
        <BsCopy />
      </button>
      <div className="underBackNav px-4 font-primary">
        <div className="flex mt-3">
          <div className="px-1">
            <img
              src={currentUser.image || userPic}
              alt="User Profile Pic"
              className="w-16 h-16 object-cover"
            />
          </div>

          <div className="flex-1">
            <textarea
              ref={messageRef}
              rows={25}
              className="border outline-none text-xs w-full p-3"
              defaultValue={message}
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-5">
          <h2 className="font-bold border-b">Share on:</h2>
          <div className="flex justify-between">
            <a href={whatsappLink}>
              <div className="text-sm flex flex-col items-center cursor-pointer">
                <FaWhatsapp className="text-primary" size={30} />
                <span>WhatsApp</span>
              </div>
            </a>
            <a href="https://www.facebook.com">
              <div className="text-sm flex flex-col items-center cursor-pointer">
                <FaFacebook className="text-blue-600" size={30} />
                <span>Facebook</span>
              </div>
            </a>
            <a href={twitterLink}>
              <div className="text-sm flex flex-col items-center cursor-pointer">
                <FaTwitter className="text-blue-400" size={30} />
                <span>Twitter</span>
              </div>
            </a>
            <a href={linkedInLink}>
              <div className="text-sm flex flex-col items-center cursor-pointer">
                <FaLinkedin className="text-blue-500" size={30} />
                <span>LinkedIn</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;
