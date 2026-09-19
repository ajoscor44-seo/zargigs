import React from "react";
import Legal from "../components/Landing/Legal";

const TermsOfUse = () => {
  const terms = [
    {
      title: "Introduction",
      description:
        "Welcome to DocsZAR! By accessing or using our services, you agree to comply with and be bound by these Terms and Services. Please read them carefully.",
    },
    {
      title: "Acceptance of Terms",
      description:
        "By using our services, you accept and agree to be bound by these terms. If you do not agree, please do not use our services.",
    },
    {
      title: "Use of the Service",
      useList: true,
      list: [
        "Eligibility: You must be at least 18 years old to use our services.",
        "Account Registration: You must provide accurate and complete information when creating an account.",
        "User Conduct: You agree not to use our services for any unlawful or prohibited activities. This includes posting false information or engaging in fraudulent activity.",
      ],
    },
    {
      title: "Intellectual Property",
      description:
        "All content on DocsZAR, including text, graphics, logos, and software, is the property of DocsZAR or its licensors and is protected by applicable laws.",
    },
    {
      title: "Payment and Fees",
      useList: true,
      list: [
        "Membership Fee: A non-refundable membership fee of N1000 is required to access verified task earning features.",
        "Task Payments: Payments for completed tasks will be processed according to our verification guidelines.",
        "Referral Fees: Referral bonuses are credited upon active referral qualification.",
      ],
    },
    {
      title: "Termination",
      description:
        "We reserve the right to suspend or terminate your account at any time if you violate these terms or engage in fraudulent activity.",
    },
    {
      title: "Limitation of Liability",
      description:
        "DocsZAR is not liable for any indirect, incidental, or consequential damages arising out of your use of our services.",
    },
    {
      title: "Contact Us",
      description:
        "If you have any questions about these terms, please contact us at",
      useLink: true,
      href: "mailto:contactdocszar@gmail.com",
      linkText: "contactdocszar@gmail.com",
    },
  ];

  return <Legal title={"Terms Of Use"} data={terms} />;
};

export default TermsOfUse;
