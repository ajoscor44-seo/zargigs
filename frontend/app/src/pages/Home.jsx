import React, { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import LandingNavBar from "../components/Landing/NavBar";
import Footer from "../components/Landing/Footer";
import girl_pointing from "../assets/images/girl-pointing.png";
import lady_advertiser from "../assets/images/lady-advertiser.jpg";
import man_earner from "../assets/images/earner-showcase.jpg";
import {
  FaBoltLightning,
  FaCheck,
  FaChevronDown,
  FaArrowRight,
  FaBriefcase,
  FaWallet,
  FaGlobe,
  FaBullhorn,
  FaPenNib,
  FaPalette,
  FaLaptopCode,
  FaChartSimple,
  FaMobileScreen,
  FaListCheck,
  FaCoins,
  FaArrowTrendUp,
  FaCircleCheck,
  FaRegCircleCheck,
  FaShieldHalved,
} from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const categories = [
  { name: "Digital Marketing", icon: <FaBullhorn /> },
  { name: "Social Media Tasks", icon: <FaMobileScreen /> },
  { name: "Content Creation", icon: <FaPenNib /> },
  { name: "Writing", icon: <FaPenNib /> },
  { name: "Graphic Design", icon: <FaPalette /> },
  { name: "Website Testing", icon: <FaLaptopCode /> },
  { name: "Data Collection", icon: <FaListCheck /> },
  { name: "Research", icon: <FaChartSimple /> },
  { name: "SEO", icon: <FaBoltLightning /> },
  { name: "App Testing", icon: <FaMobileScreen /> },
  { name: "Surveys & Feedback", icon: <FaListCheck /> },
  { name: "Virtual Assistance", icon: <FaBriefcase /> },
];

const steps = [
  {
    num: "01",
    title: "1. Create Your Account",
    desc: "Sign up and set up your profile in just a few minutes.",
    icon: <FaShieldHalved className="text-emerald-600 text-xl" />,
  },
  {
    num: "02",
    title: "2. Find Tasks",
    desc: "Browse available jobs and choose tasks you are comfortable completing.",
    icon: <FaListCheck className="text-emerald-600 text-xl" />,
  },
  {
    num: "03",
    title: "3. Complete the Work",
    desc: "Follow the task requirements and submit your work for review.",
    icon: <FaLaptopCode className="text-emerald-600 text-xl" />,
  },
  {
    num: "04",
    title: "4. Get Paid",
    desc: "Once your work is successfully approved, your earnings are added to your account.",
    icon: <FaCoins className="text-emerald-600 text-xl" />,
  },
];

const servicePillars = [
  {
    title: "Micro Tasks",
    desc: "Post simple tasks that can be completed quickly by multiple workers.",
    icon: <FaBoltLightning className="text-amber-500 text-2xl" />,
    badge: "High Volume",
    bg: "bg-amber-50 border-amber-100",
  },
  {
    title: "Freelance Services",
    desc: "Find skilled freelancers for writing, design, marketing, development and other professional services.",
    icon: <FaPalette className="text-emerald-500 text-2xl" />,
    badge: "Specialized",
    bg: "bg-emerald-50 border-emerald-100",
  },
  {
    title: "Business Tasks",
    desc: "Outsource repetitive or time consuming work so you can focus on growing your business.",
    icon: <FaBriefcase className="text-blue-500 text-2xl" />,
    badge: "Growth",
    bg: "bg-blue-50 border-blue-100",
  },
  {
    title: "Digital Projects",
    desc: "Connect with experienced professionals for larger projects requiring specialised skills.",
    icon: <FaLaptopCode className="text-purple-500 text-2xl" />,
    badge: "Enterprise",
    bg: "bg-purple-50 border-purple-100",
  },
];

const businessNeeds = [
  "Need people to test your new app?",
  "Need feedback on a website?",
  "Need help researching something?",
  "Need content created?",
  "Need people to promote your business?",
  "Need a repetitive online task completed?",
];

const forBusinesses = [
  "Save time by outsourcing tasks.",
  "Reach people ready to work.",
  "Choose workers based on your requirements.",
  "Set your own budget.",
  "Manage jobs from one place.",
  "Pay for successfully completed work.",
];

const forWorkers = [
  "Discover new earning opportunities.",
  "Choose tasks that suit you.",
  "Work on your own schedule.",
  "Build your reputation through successful jobs.",
  "Use your existing skills to earn.",
  "Access different types of work from one account.",
];

const faqs = [
  {
    q: "What kind of tasks can I post?",
    a: "You can post a wide range of permitted digital and freelance tasks, including marketing, research, testing, writing, design, data collection, feedback and other online services.",
  },
  {
    q: "How do I earn?",
    a: "Create an account, browse available tasks, complete the requirements and submit your work. Once your submission is approved, you receive the stated payment.",
  },
  {
    q: "Do I need professional experience?",
    a: "Not necessarily. Some tasks require specific skills or experience, while others are simple tasks that almost anyone who meets the requirements can complete.",
  },
  {
    q: "Can businesses hire multiple people?",
    a: "Yes. Businesses can create tasks that require one person or many participants, depending on the type of work they need completed.",
  },
  {
    q: "Can I work whenever I want?",
    a: "You can browse available opportunities and choose the tasks you want to complete, subject to each task's requirements and deadline.",
  },
];

const Home = () => {
  const { currentUser } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const primaryHireLink = currentUser ? "/create-task" : "/signup";
  const primaryEarnLink = currentUser ? "/earn" : "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-primary text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      <LandingNavBar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (FORMER DESIGN WITH GIRL POINTING & LIVE STATS) */}
        {/* ========================================================================= */}
        <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 text-center lg:text-left">
                {/* Top Tag Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200/80 shadow-xs mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-800 tracking-wide">
                    Africa's Leading Real-User & Micro-Task Marketplace
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Get Things Done.{" "}
                  <span className="text-emerald-600">
                    Earn While Doing It.
                  </span>
                </h1>

                {/* Subheading */}
                <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Connect with real people ready to work, or turn your skills and spare time into money. Whether you need help promoting your business, testing a website, creating content, gathering information or completing simple online tasks, our marketplace makes it easy to find people who can get it done. And if you are looking to earn, there are opportunities waiting for you.
                </p>

                {/* Call To Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to={primaryHireLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span>Post a Task</span>
                    <FaArrowRight size={14} />
                  </Link>
                  <Link
                    to={primaryEarnLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-300 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                  >
                    <span>Start Earning</span>
                  </Link>
                </div>

                {/* Live Metrics Strip */}
                <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">100K+</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Active Members</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">₦50M+</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Earnings Paid</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.9%</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Instant Payouts</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Graphic with Girl Pointing */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md lg:max-w-none">
                  {/* Background solid decorative card */}
                  <div className="absolute inset-0 bg-emerald-100/50 rounded-3xl -rotate-3 transform scale-95 -z-10" />

                  <img
                    src={girl_pointing}
                    alt="Get Things Done & Earn with DocsZAR"
                    className="relative z-10 w-full max-h-[520px] object-contain drop-shadow-2xl mx-auto"
                  />

                  {/* Floating Pill Card 1: Task Completed */}
                  <div className="absolute top-10 -left-4 sm:left-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <FaCoins size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Daily Task Paid</div>
                      <div className="text-sm font-bold text-slate-900">+₦2,500 Credited</div>
                    </div>
                  </div>

                  {/* Floating Pill Card 2: Campaign Reach */}
                  <div className="absolute bottom-8 -right-4 sm:right-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                      <FaArrowTrendUp size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Campaign Growth</div>
                      <div className="text-sm font-bold text-emerald-600">+12.4K Real Followers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. ONE MARKETPLACE. TWO WAYS TO WIN */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
                Dual-Sided Marketplace
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                One Marketplace. Two Ways to Win.
              </h2>
              <p className="text-base text-slate-600">
                Whether you need something done or want to earn money, our marketplace brings both sides together.
              </p>
            </div>

            {/* Side 1: Need Something Done? (Lady Advertiser Showcase) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <img
                    src={lady_advertiser}
                    alt="Post a Task"
                    className="w-full rounded-3xl shadow-lg object-cover aspect-4/5 border border-slate-100"
                  />
                  <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <FaCircleCheck size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Task Completion</div>
                      <div className="text-sm font-bold text-slate-900">99.8% Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <FaBriefcase /> For Businesses & Clients
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Need Something Done?
                </h3>

                <p className="text-base text-slate-600 leading-relaxed">
                  Post your task and connect with people ready to complete it. From quick online jobs to specialised projects, you decide what you need, how much you want to pay and who you want to work with.
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Get help with:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {categories.map((cat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                      >
                        <span className="text-emerald-600 shrink-0">{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={primaryHireLink}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <span>Post a Task</span>
                    <FaArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Side 2: Want to Earn Money? (Man Earner Showcase) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
              <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                  <FaWallet /> For Workers & Freelancers
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Want to Earn Money?
                </h3>

                <p className="text-base text-slate-600 leading-relaxed">
                  Turn your time, skills and knowledge into income. Browse available tasks, choose the ones you can complete, follow the instructions and earn when your work is successfully approved.
                </p>

                <p className="text-sm font-semibold text-slate-800">
                  You decide what you want to work on and when you want to work.
                </p>

                <div className="pt-2">
                  <Link
                    to={primaryEarnLink}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md shadow-slate-900/15 transition-all"
                  >
                    <span>Browse Tasks</span>
                    <FaArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <img
                    src={man_earner}
                    alt="Want to Earn Money"
                    className="w-full rounded-3xl shadow-lg object-cover aspect-4/5 border border-slate-100"
                  />
                  <div className="absolute -top-4 -left-4 sm:left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <FaCoins size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500">Daily Payouts</div>
                      <div className="text-sm font-bold text-slate-900">Instant Wallet Crediting</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. EARN YOUR WAY (4 STEPS) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                How It Works
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Earn Your Way
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                You do not need a complicated setup to get started. Create your account, discover available opportunities and complete tasks that match your abilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative p-7 rounded-3xl bg-white border border-slate-200/90 space-y-4 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                to={primaryEarnLink}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 transition-all"
              >
                <span>Start Earning Today</span>
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. WHATEVER YOU NEED DONE, FIND SOMEONE FOR IT */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  Outsource In Seconds
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Whatever You Need Done, <br />
                  Find Someone for It.
                </h2>

                <p className="text-base text-slate-600 leading-relaxed">
                  Running a business often means having hundreds of small things competing for your attention. You should not have to do everything yourself. Post your requirements and connect with people who can help you complete tasks quickly and affordably.
                </p>

                <p className="text-sm font-semibold text-slate-700">
                  Post it and find people ready to work.
                </p>

                <div className="pt-2">
                  <Link
                    to={primaryHireLink}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <span>Get Started</span>
                    <FaArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {businessNeeds.map((need, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <FaCheck size={12} />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 leading-snug">
                      {need}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FROM QUICK TASKS TO SKILLED SERVICES */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                From Quick Tasks to Skilled Services
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Not every job is the same. Sometimes you need hundreds of people to complete a simple task. Other times, you need one skilled person to handle an important project. Our marketplace gives you the flexibility to find the right people for both.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicePillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white border border-slate-200/80 space-y-4 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${pillar.bg}`}>
                        {pillar.icon}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider">
                        {pillar.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. WORK WITH PEOPLE AROUND THE WORLD */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-emerald-900 text-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-600 text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <FaGlobe size={26} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Work With People Around the World
            </h2>
            <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl mx-auto font-normal">
              Your next opportunity does not have to be limited by location. Businesses can reach a diverse community of workers and freelancers, while workers can discover earning opportunities from clients looking for their skills. One platform brings both sides together.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. WHY USE OUR MARKETPLACE? */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Why Use Our Marketplace?
              </h2>
              <p className="text-base text-slate-600">
                Designed for businesses looking to scale and individuals looking to monetize their time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* For Businesses */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                    <FaBriefcase />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">For Businesses</h3>
                </div>

                <ul className="space-y-3.5 list-none pl-0">
                  {forBusinesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <FaCheck className="text-emerald-600 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Workers */}
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-lg">
                    <FaWallet />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">For Workers</h3>
                </div>

                <ul className="space-y-3.5 list-none pl-0">
                  {forWorkers.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <FaCheck className="text-orange-600 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. CALLOUT BANNER */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Next Task Could Be Someone Else's Next Opportunity
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every task needs someone to complete it. Every skill can create an opportunity. Whether you are here to grow your business, get something off your to do list or earn extra income, you can start today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to={primaryHireLink}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
              >
                I Want to Hire
              </Link>
              <Link
                to={primaryEarnLink}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all"
              >
                I Want to Earn
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section id="faq" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                Got Questions?
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-slate-900 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <FaChevronDown
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                        size={14}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. READY TO GET STARTED? (FINAL CTA) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50 border-t border-slate-200 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl font-bold text-emerald-600">
              Get work done or get paid for doing it.
            </p>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Join a marketplace where businesses find people who can help and people find opportunities to earn.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to={primaryHireLink}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Post Your First Task</span>
                <FaArrowRight size={14} />
              </Link>
              <Link
                to={primaryEarnLink}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-slate-800 border border-slate-300 font-semibold text-base shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Start Earning</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
