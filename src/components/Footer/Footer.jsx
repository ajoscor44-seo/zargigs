import React from "react";
import { MdMail, MdMailOutline } from "react-icons/md";

const Footer = () => {
  return (
    <div className="bg-white p-5">
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
          <li className="footer_list-item">Create Account</li>
          <li className="footer_list-item">Login</li>
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
            <span>gigsflix@gmail.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
