import React from "react";
import BackNav from "../components/BackNav/BackNav";
import ClientMenuBar from "../components/ClientMenuBar/ClientMenuBar";
import adminData from "../data/adminData";
import numeral from "numeral";
import { Link } from "react-router-dom/cjs/react-router-dom";
import PayAmountBar from "../components/PayAmountBar/PayAmountBar";

const BecomeAMember = () => {
  return (
    <div className="flex fullHeight">
      <BackNav pageName={"Perform Social Tasks And Earn"} />
      <div className="underBackNav flex flex-col flex-1 font-primary bg-white mt-3 highBase">
        <span className="text-center text-xs mb-1">Become a Member Today</span>
        <h2 className="font-bold text-2xl px-2 text-center">
          Turn Your Social Media Accounts into a Money Making Machine!
        </h2>
        <p className="text-xs leading-5 font-semibold py-2 px-4">
          Do you know you can earn daily income by performing social media tasks
          such as likes, follows, comments, shares, retweets etc. That is one of
          the many benefits of becoming a member on Gigsflix.
        </p>
        <div>
          <h3 className="text-xs mb-5 mt-3 px-4 leading-5">
            When you activate your account with a one-time membership fee of ₦
            {numeral(adminData.membershipFee).format("0,0")}, you get lifetime
            access to enjoy the following benefits:
          </h3>
          <ul className="list-disc pl-12 pr-4">
            <li className="text-xs font-semibold leading-5 mb-5">
              <span className="font-extrabold">Earn steady daily figures</span>{" "}
              by following, liking, commenting, sharing, retweeting or posting
              adverts for businesses on your social media. Click{" "}
              <Link to="/earn">
                <span className="text-primaryLight hover:underline">here </span>
              </Link>
              to see what you will earn when you perform social tasks
            </li>
            <li className="text-xs font-semibold leading-5 mb-5">
              <span className="font-extrabold">
                Earn an Instant Referral Commission of ₦500
              </span>{" "}
              when you refer someone to become a member on Hawkit. The more you
              refer, the more you earn. Click{" "}
              <span className="text-primaryLight hover:underline">here</span> to
              learn how referral works.
            </li>
            <li className="text-xs font-semibold leading-5 mb-5">
              <span className="font-extrabold">
                Earn Social Boost Referral Commission of 20% of any amount paid
              </span>{" "}
              when you refer someone to Buy Likes, Followers, Comments, Shares,
              Whatsapp Post Views etc. Click{" "}
              <span className="text-primaryLight hover:underline">here</span> to
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
          fee={adminData.membershipFee}
          btnText={"Click Here To Pay Now"}
        />
      </div>
    </div>
  );
};

export default BecomeAMember;
