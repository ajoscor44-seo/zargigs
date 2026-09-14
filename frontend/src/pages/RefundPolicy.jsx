import React from "react";
import Legal from "../components/Legals/Legal";

const RefundPolicy = () => {
  const policies = [
    {
      title: "Membership Fee",
      description:
        "The N1000 membership fee is non-refundable. This fee grants you access to our platform and its features, and as such, is not subject to refund under any circumstances.",
    },
    {
      title: "Task Payments",
      description:
        "Payments for completed tasks are final once they have been verified and credited to your Gigsflix wallet. We do not offer refunds for completed tasks.",
    },
    {
      title: "Referral Fees",
      description:
        "Referral fees are paid out after verification of the referred accounts. Once paid, these fees are non-refundable.",
    },
    {
      title: "Disputes and Resolutions",
      description:
        "If you believe there has been a mistake or an issue with a payment, please contact us within 7 days of the transaction. We will review your case and respond within a reasonable timeframe.",
    },
    {
      title: "Changes to This Policy",
      description:
        "We may update this refund policy from time to time. We will notify you of any changes by posting the new policy on our site.",
    },
    {
      title: "Contact Us",
      description:
        "If you have any questions about our refund policy, please contact us at: ",
      useLink: true,
      href: "mailto:contactgigsflix@gmail.com",
      linkText: "contactgigsflix@gmail.com",
    },
  ];

  return <Legal title={"Refund Policy"} data={policies} />;
};

export default RefundPolicy;
