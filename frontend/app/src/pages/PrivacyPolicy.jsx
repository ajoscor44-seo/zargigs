import React from "react";
import Legal from "../components/Landing/Legal";

const PrivacyPolicy = () => {
  const policies = [
    {
      title: "Introduction",
      description:
        "Welcome to DocsZAR.com. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and share information about you when you use our services.",
    },
    {
      title: "Information We Collect",
      useList: true,
      list: [
        "Personal Information: Name, email address, phone number, and payment information.",
        "Usage Data: Information about how you use our site, IP address, browser type, and operating system.",
        "Cookies and Tracking Technologies: We use cookies to enhance your experience and gather information about our users.",
      ],
    },
    {
      title: "How We Use Your Information",
      useList: true,
      list: [
        "To provide and improve our services.",
        "To communicate with you about your account and our services.",
        "To process transactions and send you related information.",
        "To personalize your experience and to deliver content specific to your interests.",
        "To comply with legal obligations and protect our legal rights.",
      ],
    },
    {
      title: "Sharing Your Information",
      useList: true,
      list: [
        "Third-Party Service Providers: We may share your information with third-party service providers who perform services on our behalf.",
        "Business Transfers: In the event of a merger, sale, or other business transfer, your information may be transferred as part of that transaction.",
        "Legal Requirements: We may disclose your information to comply with legal obligations or to protect our rights.",
      ],
    },
    {
      title: "Your Choices",
      useList: true,
      list: [
        "Account Information: You can update or correct your account information at any time by logging into your account.",
        "Cookies: Most web browsers are set to accept cookies by default. You can choose to set your browser to remove or reject cookies.",
      ],
    },
    {
      title: "Data Security",
      description:
        "We implement reasonable security measures to protect the security of your personal information. However, no system is completely secure, and we cannot guarantee the security of your information.",
    },
    {
      title: "Changes to This Privacy Policy",
      description:
        "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on our site.",
    },
    {
      title: "Contact Us",
      description:
        "If you have any questions about this privacy policy, please contact us at",
      useLink: true,
      href: "mailto:contactdocszar@gmail.com",
      linkText: "contactdocszar@gmail.com",
    },
  ];

  return <Legal title={"Privacy Policy"} data={policies} />;
};

export default PrivacyPolicy;
