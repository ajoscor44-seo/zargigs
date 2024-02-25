import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white px-4 py-10">
      <div className="flex items-center flex-col">
        <h2 className="text-2xl font-primary font-bold">About Us</h2>
        <span className="h-1 w-10 rounded-full bg-primaryLight"></span>
      </div>

      <div className="flex flex-col items-center mt-5 gap-3">
        <p className="font-primary text-center text-md">
          Welcome to <span className="font-bold text-primary">GigsFlix</span>,
          your go-to platform for monetizing your social media presence!.
        </p>
        <p className="font-primary text-center text-md">
          At <span className="font-bold text-primary">GigsFlix</span>, we
          believe in the power of social media and the potential it holds for
          earning opportunities.
        </p>
        <span className="font-primary text-center text-md font-extrabold">
          {" "}
          Whether you are a social media enthusiast or a content creator looking
          for ways to earn, we've got you covered.
        </span>
        <p className="font-primary text-center text-md">
          Our platform is designed to be user-friendly and accessible to
          everyone, regardless of the size of your following.
        </p>
        <p className="font-primary font-extrabold text-center text-md">
          It’s time to make your social media work for you.{" "}
        </p>
        <span className="font-bold text-center text-orange-500">
          Welcome to the future of social media monetization!
        </span>
      </div>
    </div>
  );
};

export default AboutUs;
