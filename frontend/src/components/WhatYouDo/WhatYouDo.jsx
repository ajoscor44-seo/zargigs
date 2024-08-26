import React from "react";
import postAdvertImg from "../../assets/png/post-advert.png";
import man_member from "../../assets/images/blackman-with-phone.png";

const WhatYouDo = () => {
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;

  return (
    <div className="bg-white px-4 py-10 grid lg:grid-cols-2 lg:pt-20 lg:px-72 lg:justify-center lg:items-start">
      <div className="lg:order-2">
        <img
          src={man_member}
          className="mb-10 p-2 object-cover mx-auto"
          style={{ height: "420px" }}
        />
      </div>
      <div>
        <div className="flex items-center flex-col">
          <h2 className="text-3xl font-primary font-bold">For Members</h2>
          <span className="h-1 w-10 rounded-full bg-green-500"></span>
        </div>

        <div className="flex flex-col items-center mt-5 gap-10 py-3">
          <div className="grid grid-flow-col gap-3 items-start">
            <div className="service_icon border p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-blue-500 transition duration-500 hover:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                />
              </svg>
            </div>

            <div>
              <p className="font-bold text-lg font-primary">
                Like and Share Posts
              </p>
              <p className="font-medium text-sm font-primary mt-2 pr-2">
                Earn by engaging with content. Simply like or share posts from
                various brands and get rewarded for your interactions.
              </p>
            </div>
          </div>
          <div className="grid grid-flow-col gap-3 items-start">
            <div className="service_icon border p-4 rounded-full">
              <img
                className="w-8 h-8"
                src={postAdvertImg}
                alt="postAdvertImg"
              />
            </div>

            <div>
              <p className="font-bold text-lg font-primary">Post Adverts</p>
              <p className="font-medium text-sm font-primary mt-2 pr-2">
                Leverage your audience by posting sponsored content. We connect
                you with brands that resonate with your followers, ensuring
                authenticity and engagement.
              </p>
            </div>
          </div>
          <div className="grid grid-flow-col gap-3 items-start">
            <div className="service_icon border p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-orange-400 transition duration-500 hover:rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </div>

            <div>
              <p className="font-bold text-lg font-primary">Flexible Earning</p>
              <p className="font-medium text-sm font-primary mt-2 pr-2">
                Our platform offers a variety of earning opportunities to suit
                your interests and social media habits. Choose what fits you
                best and start earning today.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <a href={`${app_url}/signup`} target="_blank">
              <button className="btn bg-green-500 rounded-sm text-white">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatYouDo;
