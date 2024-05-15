import React from "react";
import { MdMail } from "react-icons/md";

const Footer = () => {
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;

  return (
    <div className="bg-white p-5 lg:flex lg:justify-center gap-20">
      <div>
        <h2 className="footer_head">Company</h2>
        <ul className="footer_list">
          <li className="footer_list-item">About</li>
          <li className="footer_list-item">Careers</li>
          <li className="footer_list-item">Terms</li>
          <li className="footer_list-item">Refund Policy</li>
          <li className="footer_list-item">Privacy Policy</li>
        </ul>
      </div>
      <div>
        <h2 className="footer_head">Quick Links</h2>
        <ul className="footer_list">
          <a href={`${app_url}/signup`} target="_blank">
            <li className="footer_list-item">Create Account</li>
          </a>
          <a href={`${app_url}/login`} target="_blank">
            <li className="footer_list-item">Login</li>
          </a>
          <li className="footer_list-item">Terms</li>
          <li className="footer_list-item">Pricing</li>
          <li className="footer_list-item">Earnings</li>
        </ul>
      </div>
      <div>
        <h2 className="footer_head">Support</h2>
        <ul className="footer_list">
          <li className="footer_list-item">Contact Support</li>
          <li className="footer_list-item">Frequently Asked Questions</li>
          <li className="footer_list-item">Knowledgebase</li>
        </ul>
      </div>
      <div>
        <h2 className="footer_head">Contact Us</h2>
        <ul className="footer_list">
          <li className="footer_list-item flex items-center gap-2">
            <MdMail size={20} />
            <span>gigsflixtechnologies@gmail.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
