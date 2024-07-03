import React from "react";
import { MdMail } from "react-icons/md";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  const app_url =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_APP_URL
      : import.meta.env.VITE_PROD_APP_URL;

  const scrollTo = (to) => {
    window.scrollTo({
      top: to,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-slate-50 p-5 lg:flex lg:justify-center gap-20">
      <div>
        <h2 className="footer_head">Company</h2>
        <ul className="footer_list">
          <li
            className="footer_list-item block lg:hidden"
            onClick={() => {
              scrollTo(3200);
            }}
          >
            About
          </li>
          <li
            className="footer_list-item hidden lg:block"
            onClick={() => {
              scrollTo(2000);
            }}
          >
            About
          </li>
          <li className="footer_list-item">
            <a href="#">Careers</a>
          </li>
          <li className="footer_list-item">
            <a href={"https://www.gigsflix.com/refund-policy"}>Refund Policy</a>
          </li>
          <li className="footer_list-item">
            <a href={"https://www.gigsflix.com/privacy-policy"}>
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="footer_head">Quick Links</h2>
        <ul className="footer_list">
          <li className="footer_list-item">
            <a href={`${app_url}/signup`} target="_blank">
              Create Account
            </a>
          </li>
          <li className="footer_list-item">
            <a href={`${app_url}/login`} target="_blank">
              Login
            </a>
          </li>
          <li className="footer_list-item">
            <a href={"https://www.gigsflix.com/terms"}>Terms</a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="footer_head">Support</h2>
        <ul className="footer_list">
          <li className="footer_list-item">
            <a href="https://wa.link/l2u70b" target="_blank">
              Contact Support
            </a>
          </li>
          <li className="footer_list-item">
            <a href="https://medium.com/@contactgigsflix" target="_blank">
              Frequently Asked Questions
            </a>
          </li>
          <li className="footer_list-item">
            <a href="https://medium.com/@contactgigsflix" target="_blank">
              Knowledgebase
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="footer_head">Contact Us</h2>
        <ul className="footer_list">
          <li className="footer_list-item flex items-center gap-2">
            <MdMail className="text-red-500" size={20} />
            <span>
              <a target="_blank" href="mailto:gigsflixtechnologies@gmail.com">
                gigsflixtechnologies@gmail.com
              </a>
            </span>
          </li>
          <li className="footer_list-item flex items-center gap-2">
            <FaTwitter className="text-sky-400" size={20} />
            <span>
              <a target="_blank" href="https://x.com/GigsflixTech/">
                Gigsflix Tech
              </a>
            </span>
          </li>
          <li className="footer_list-item flex items-center gap-2">
            <FaFacebook className="text-blue-700" size={20} />
            <span>
              <a target="_blank" href="https://facebook.com/gigsflix">
                Gigsflix
              </a>
            </span>
          </li>
          <li className="footer_list-item flex items-center gap-2">
            <FaInstagram
              className="bg-instagram-gradient text-white rounded"
              size={20}
            />
            <span>
              <a
                target="_blank"
                href="https://www.instagram.com/gigsflix_tech/"
              >
                Gigsflix Technologies
              </a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
