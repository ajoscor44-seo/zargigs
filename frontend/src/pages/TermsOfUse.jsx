import React from "react";
import Legal from "../components/Legals/Legal";

const TermsOfUse = () => {
  const terms = [
    {
      title: "Introduction",
      description:
        "Welcome to Gigsflix! By accessing or using our services, you agree to comply with and be bound by these Terms and Services. Please read them carefully.",
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
        "User Conduct: You agree not to use our services for any unlawful or prohibited activities. This includes, but is not limited to: posting false or misleading information, engaging in fraudulent activities, violating any local, state, national, or international law.",
      ],
    },
    {
      title: "Intellectual Property",
      description:
        "All content on Gigsflix, including text, graphics, logos, and software, is the property of Gigsflix or its licensors and is protected by copyright and other intellectual property laws.",
    },
    {
      title: "Payment and Fees",
      useList: true,
      list: [
        "Membership Fee: A non-refundable membership fee of N1000 is required to access certain features of our platform.",
        "Task Payments: Payments for completed tasks will be processed according to our payment schedule.",
        "Referral Fees: The default referral fee is N600, but it is negotiable based on your influence and pull.",
      ],
    },
    {
      title: "Termination",
      description:
        "We reserve the right to suspend or terminate your account at any time if you violate these terms or engage in any fraudulent or illegal activity.",
    },
    {
      title: "Limitation of Liability",
      description:
        "Gigsflix is not liable for any indirect, incidental, or consequential damages arising out of or in connection with your use of our services.",
    },
    {
      title: "Changes to the Terms",
      description:
        "We may update these terms from time to time. We will notify you of any changes by posting the new terms on our site.",
    },
    {
      title: "Governing Law",
      description:
        "These terms are governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law principles.",
    },
    {
      title: "Contact Us",
      description:
        "If you have any questions about this privacy policy, please contact us at",
      useLink: true,
      href: "mailto:contactgigsflix@gmail.com",
      linkText: "contactgigsflix@gmail.com",
    },
  ];

  return (
    <div className="border">
      <Legal title={"Term Of Use"} data={terms} />
    </div>
  );
};

export default TermsOfUse;
