import React, { useState } from "react";
import axios from "axios";
import { LuSend } from "react-icons/lu";
import { GrPowerReset } from "react-icons/gr";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp, IoMail } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa6";

const ContactUs = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitForm = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      let formData = {};

      for (let i = 0; i < 3; i++) {
        const input = e.target[i];
        formData[`${input["name"]}`] = input.value;
      }
      const res = await axios.post("/api/v1/send-mail", formData);
      const data = res.data;
      console.log(formData, data);
      setError(null);
      setLoading(false);
      setMessage(data.message);
      const message_time_out = setTimeout(() => {
        setMessage(null);
        return clearTimeout(message_time_out);
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage(null);
      setLoading(false);
      setError(error.response.data.message);
      const error_time_out = setTimeout(() => {
        setError(null);
        return clearTimeout(error_time_out);
      }, 3000);
    }
  };
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white px-4 py-10 max-w-xl">
        <div className="flex items-center flex-col">
          <h2 className="text-2xl font-primary font-bold">Contact Us</h2>
          <span className="h-1 w-10 rounded-full bg-green-500"></span>
        </div>
        {(error || message) && (
          <p className="mx-2 flex flex-col mt-3 font-semibold text-center text-sm">
            {error ? (
              <span className="rounded bg-red-200 text-red-500 py-1">
                {error}
              </span>
            ) : (
              <span className="rounded bg-green-200 text-green-500 py-1">
                {message}
              </span>
            )}
          </p>
        )}
        <form
          onSubmit={(e) => submitForm(e)}
          className="contact_form flex flex-col gap-4 px-4 py-5"
        >
          <div className="flex flex-col">
            <span className="text-primary text-lg mb-1 font-primary font-bold">
              Fullname:
            </span>
            <input
              type="text"
              name="fullname"
              placeholder="Your Fullname"
              className="border p-3 rounded outline-green-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-primary text-lg mb-1 font-primary font-bold">
              Email:
            </span>
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              className="border p-3 rounded outline-green-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-primary text-lg mb-1 font-primary font-bold">
              Message:
            </span>
            <textarea
              name="message"
              placeholder="Short Message..."
              className="border p-3 rounded outline-green-500"
            ></textarea>
          </div>
          <div className="flex gap-4 justify-end">
            <button
              disabled={loading}
              className="btn rounded bg-red-500 text-white font-primary font-bold flex items-center"
            >
              <GrPowerReset size={15} className="me-2" />
              Reset
            </button>
            <button
              disabled={loading}
              className="btn rounded bg-sky-400 text-white font-primary font-bold flex items-center"
            >
              <LuSend size={15} className="me-2" />
              {loading ? <FaSpinner size={15} /> : "Send"}
            </button>
          </div>

          <div className="flex flex-col gap-3 border rounded-md p-2">
            <div className="grid grid-flow-col py-2">
              <IoLocationSharp className="me-2 mt-1 text-red-500" size={25} />
              <div className="social_value">
                <span className="font-bold font-primary text-lg">
                  Location:
                </span>
                <p className="font-primary">
                  No 15 Elesare Quarters, Orita Obele, Akure, Nigeria
                </p>
              </div>
            </div>
            <div className="flex py-2">
              <FaPhoneAlt className="me-3 mt-2 text-green-500" size={20} />
              <div className="social_value">
                <span className="font-bold font-primary text-lg">Phone:</span>
                <p className="font-primary">+234-91-241-9623</p>
              </div>
            </div>
            <div className="flex py-2">
              <IoMail className="me-3 mt-1 text-orange-500" size={25} />
              <div className="social_value">
                <span className="font-bold font-primary text-lg">Mail:</span>
                <p className="font-primary">gigsflixtechnologies@gmail.com</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
