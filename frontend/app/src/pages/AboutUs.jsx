import React from "react";
import Legal from "../components/Landing/Legal";

const AboutUs = () => {
  const data = [
    {
      title: "Welcome to DocsZAR",
      description:
        "Welcome to DocsZAR. DocsZAR is a dynamic platform designed to connect users with a wide range of earning opportunities. Whether you're looking to complete simple tasks, promote products, or engage in various online activities, DocsZAR provides a user-friendly environment to help you achieve your financial goals.",
    },
    {
      title: "Our Mission",
      description:
        "Our mission is to empower individuals by providing them with flexible and accessible earning opportunities. We believe in the power of the gig economy and strive to create a platform that benefits both task creators and task performers.",
    },
    {
      title: "What We Offer",
      useList: true,
      list: [
        "Diverse Tasks: From social media engagements to app downloads and surveys, we offer a variety of tasks to suit different skills and interests.",
        "User-Friendly Interface: Our platform is designed to be intuitive and easy to navigate, ensuring a seamless experience for all users.",
        "Reliable Payments: We prioritize timely and secure payments to ensure that our users are rewarded fairly for their efforts.",
      ],
    },
    {
      title: "Join Us",
      description:
        "Become a part of the DocsZAR community and start earning today. Whether you're a task creator looking to promote your business or a task performer seeking new opportunities, DocsZAR is here to support you.",
    },
    {
      title: "Contact Us",
      description: "For more information, feel free to contact us at",
      useLink: true,
      href: "mailto:contactdocszar@gmail.com",
      linkText: "contactdocszar@gmail.com",
    },
  ];

  return <Legal title={"About Us"} data={data} />;
};

export default AboutUs;
