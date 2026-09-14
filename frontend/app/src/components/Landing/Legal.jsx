import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FaArrowLeft, FaShieldHalved } from "react-icons/fa6";

const Legal = ({ title, data }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <FaArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <FaShieldHalved className="text-emerald-500" />
            <span>Official Policy</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 border-b pb-4">
            {title}
          </h1>

          <div className="space-y-8">
            {data.map((item, i) => (
              <div key={i} className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {item.title}
                </h2>
                {item.useList ? (
                  <ul className="pl-5 space-y-1.5 list-disc text-slate-600 text-sm leading-relaxed">
                    {item.list.map((lItem, idx) => (
                      <li key={idx}>{lItem}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}{" "}
                    {item.useLink && (
                      <a
                        className="text-emerald-600 font-semibold hover:underline"
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.linkText}
                      </a>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
