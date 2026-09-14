import React, { useState } from "react";
import axios from "axios";
import { LuSend } from "react-icons/lu";
import { GrPowerReset } from "react-icons/gr";
import { FaPhone, FaEnvelope, FaLocationDot, FaClock, FaCircleCheck, FaTriangleExclamation, FaSpinner } from "react-icons/fa6";

const ContactUs = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitForm = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = e.target;
      const formData = {
        fullname: form.fullname?.value,
        email: form.email?.value,
        message: form.message?.value,
      };

      const res = await axios.post("/api/v1/send-mail", formData);
      const data = res.data;
      setError(null);
      setLoading(false);
      setMessage(data.message || "Your message has been sent successfully!");
      form.reset();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setMessage(null);
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to send message. Please try again.");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-3">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Have Questions? <span className="text-emerald-600">Contact Us</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Our support team is available 24/7 to help you with advertiser campaigns, payments, or task verifications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FaLocationDot size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Office Location</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">No 15 Elesare Quarters, Orita Obele, Akure, Nigeria</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FaPhone size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Line</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">+234-91-241-9623</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <FaEnvelope size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">contactdocszar@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <FaClock size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Support Hours</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">Mon - Sun: 24/7 Fast Response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Modern Form */}
          <div className="lg:col-span-7 bg-slate-50/60 p-6 sm:p-8 rounded-2xl border border-slate-200/80">
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
                <FaCircleCheck className="text-emerald-600 shrink-0" size={18} />
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-sm font-medium">
                <FaTriangleExclamation className="text-red-600 shrink-0" size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="reset"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5"
                >
                  <GrPowerReset size={13} />
                  <span>Clear</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={14} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <LuSend size={14} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
