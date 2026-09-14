import React, { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { supabase } from "../config/supabase.config";
import {
  authService,
  userService,
  taskService,
  adminService,
  formatRecord,
} from "../services/supabaseService";

// Setup Axios request interceptor for Supabase Session & User ID
axios.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      if (data?.session?.user?.id) {
        config.headers["x-user-id"] = data.session.user.id;
      }
    }
  } catch {
    // Continue with existing headers
  }
  return config;
});

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const defaultAdminData = {
  appName: "DocsZar",
  membershipFee: 1000,
  withdrawalCharges: 50,
  minWithdrawal: 1000,
  referralBonus: 500,
  fundingAccount: {
    bankName: "Moniepoint",
    accountNumber: "8123456789",
    accountName: "DocsZar Technologies",
  },
};

const defaultAdvertPackages = [
  {
    id: "adv_whatsapp",
    title: "Post Advert on WhatsApp Status",
    platformName: "whatsapp",
    amountToPay: 150,
    amountToEarn: 100,
    pathToPage: "/advertise/whatsapp-status",
    platforms: ["whatsapp"],
    description: "Get verified Nigerian earners with 1,000+ status contacts to post your advert.",
  },
  {
    id: "adv_instagram",
    title: "Post Advert on Instagram Story & Feed",
    platformName: "instagram",
    amountToPay: 200,
    amountToEarn: 120,
    pathToPage: "/advertise/instagram-post",
    platforms: ["instagram"],
    description: "Have real creators publish your product banner or promotional reel on Instagram.",
  },
  {
    id: "adv_facebook",
    title: "Post Advert on Facebook Profile / Group",
    platformName: "facebook",
    amountToPay: 150,
    amountToEarn: 100,
    pathToPage: "/advertise/facebook-post",
    platforms: ["facebook"],
    description: "Broadcast your brand message directly to active Facebook communities.",
  },
  {
    id: "adv_twitter",
    title: "Post Advert on Twitter / X",
    platformName: "twitter",
    amountToPay: 180,
    amountToEarn: 110,
    pathToPage: "/advertise/twitter-post",
    platforms: ["twitter"],
    description: "Get users to tweet your marketing banner, link, and hashtags to their followers.",
  },
  {
    id: "adv_tiktok",
    title: "Post Advert on TikTok",
    platformName: "tiktok",
    amountToPay: 250,
    amountToEarn: 150,
    pathToPage: "/advertise/tiktok-post",
    platforms: ["tiktok"],
    description: "Pay creators to post your promotional video or audio on TikTok.",
  },
];

const defaultEngagementPackages = [
  {
    id: "eng_ig_follow",
    title: "Get Real Instagram Followers",
    platformName: "instagram",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/instagram-followers",
    platforms: ["instagram"],
    description: "Get real, active Nigerian users to follow your Instagram page or brand account.",
  },
  {
    id: "eng_ig_like",
    title: "Get Instagram Post Likes",
    platformName: "instagram",
    amountToPay: 6,
    amountToEarn: 3,
    pathToPage: "/order/instagram-likes",
    platforms: ["instagram"],
    description: "Boost your Instagram photos, reels, and carousel posts with real likes.",
  },
  {
    id: "eng_ig_comment",
    title: "Get Custom Instagram Comments",
    platformName: "instagram",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/instagram-comments",
    platforms: ["instagram"],
    description: "Get meaningful, relevant custom comments on your Instagram posts.",
  },
  {
    id: "eng_tiktok_follow",
    title: "Get TikTok Followers",
    platformName: "tiktok",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/tiktok-followers",
    platforms: ["tiktok"],
    description: "Grow your TikTok profile rapidly with real Nigerian followers.",
  },
  {
    id: "eng_tiktok_like",
    title: "Get TikTok Video Likes",
    platformName: "tiktok",
    amountToPay: 6,
    amountToEarn: 3,
    pathToPage: "/order/tiktok-likes",
    platforms: ["tiktok"],
    description: "Get real user likes on your TikTok videos.",
  },
  {
    id: "eng_yt_sub",
    title: "Get YouTube Subscribers",
    platformName: "youtube",
    amountToPay: 30,
    amountToEarn: 15,
    pathToPage: "/order/youtube-subscribers",
    platforms: ["youtube"],
    description: "Gain genuine subscribers for your YouTube channel.",
  },
  {
    id: "eng_twitter_follow",
    title: "Get Twitter / X Followers",
    platformName: "twitter",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/twitter-followers",
    platforms: ["twitter"],
    description: "Build an authentic following on Twitter / X.",
  },
  {
    id: "eng_fb_follow",
    title: "Get Facebook Page Followers",
    platformName: "facebook",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/facebook-follows",
    platforms: ["facebook"],
    description: "Grow your Facebook page likes and followers.",
  },
  {
    id: "eng_app_review",
    title: "Get App Downloads & 5-Star Reviews",
    platformName: "playstore",
    amountToPay: 50,
    amountToEarn: 25,
    pathToPage: "/order/playstore-reviews",
    platforms: ["playstore", "applestore"],
    description: "Boost your Android or iOS app ratings with real downloads and reviews.",
  },
  {
    id: "eng_spotify_stream",
    title: "Get Music Streams & Playlist Adds",
    platformName: "spotify",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/spotify-streams",
    platforms: ["spotify", "audiomack"],
    description: "Increase streams and listeners on Spotify and Audiomack.",
  },
];

const defaultAdvertEarners = [
  {
    id: "earn_adv_whatsapp",
    title: "Post Adverts on WhatsApp Status",
    platformName: "whatsapp",
    amountToEarn: 100,
    reward: 100,
    pathToPage: "/earn/whatsapp-status",
    platforms: ["whatsapp"],
    description: "Earn ₦100.00 per post by uploading our daily campaign image & caption to your WhatsApp Status.",
  },
  {
    id: "earn_adv_instagram",
    title: "Post Adverts on Instagram Story & Feed",
    platformName: "instagram",
    amountToEarn: 120,
    reward: 120,
    pathToPage: "/earn/instagram-post",
    platforms: ["instagram"],
    description: "Earn ₦120.00 per post by publishing campaign photos or reels to your Instagram.",
  },
  {
    id: "earn_adv_facebook",
    title: "Post Adverts on Facebook",
    platformName: "facebook",
    amountToEarn: 100,
    reward: 100,
    pathToPage: "/earn/facebook-post",
    platforms: ["facebook"],
    description: "Earn ₦100.00 per post by publishing sponsor banners on your Facebook page or profile.",
  },
  {
    id: "earn_adv_twitter",
    title: "Post Adverts on Twitter / X",
    platformName: "twitter",
    amountToEarn: 110,
    reward: 110,
    pathToPage: "/earn/twitter-post",
    platforms: ["twitter"],
    description: "Earn ₦110.00 by tweeting promotional messages and media to your followers.",
  },
  {
    id: "earn_adv_tiktok",
    title: "Post Adverts on TikTok",
    platformName: "tiktok",
    amountToEarn: 150,
    reward: 150,
    pathToPage: "/earn/tiktok-post",
    platforms: ["tiktok"],
    description: "Earn ₦150.00 by uploading sponsored sound tracks and videos on TikTok.",
  },
];

const defaultEngagementEarners = [
  {
    id: "earn_ig_follow",
    title: "Follow Instagram Account",
    platformName: "instagram",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "Instagram accounts you follow",
    pathToPage: "/earn/instagram-followers",
    platforms: ["instagram"],
    description: "Earn ₦5.00 for every Instagram account you follow with your profile.",
  },
  {
    id: "earn_ig_like",
    title: "Like Instagram Posts",
    platformName: "instagram",
    amountToEarn: 3,
    reward: 3,
    whatTheyDo: "Instagram posts you like",
    pathToPage: "/earn/instagram-likes",
    platforms: ["instagram"],
    description: "Earn ₦3.00 for liking photos, reels, and carousel posts on Instagram.",
  },
  {
    id: "earn_ig_comment",
    title: "Comment on Instagram Posts",
    platformName: "instagram",
    amountToEarn: 10,
    reward: 10,
    whatTheyDo: "comments you post",
    pathToPage: "/earn/instagram-comments",
    platforms: ["instagram"],
    description: "Earn ₦10.00 for posting a relevant comment on sponsored Instagram posts.",
  },
  {
    id: "earn_tiktok_follow",
    title: "Follow TikTok Accounts",
    platformName: "tiktok",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "TikTok accounts you follow",
    pathToPage: "/earn/tiktok-followers",
    platforms: ["tiktok"],
    description: "Earn ₦5.00 for each TikTok account you follow.",
  },
  {
    id: "earn_tiktok_like",
    title: "Like TikTok Videos",
    platformName: "tiktok",
    amountToEarn: 3,
    reward: 3,
    whatTheyDo: "TikTok videos you like",
    pathToPage: "/earn/tiktok-likes",
    platforms: ["tiktok"],
    description: "Earn ₦3.00 for liking specified TikTok video links.",
  },
  {
    id: "earn_yt_sub",
    title: "Subscribe to YouTube Channels",
    platformName: "youtube",
    amountToEarn: 15,
    reward: 15,
    whatTheyDo: "channels you subscribe to",
    pathToPage: "/earn/youtube-subscribers",
    platforms: ["youtube"],
    description: "Earn ₦15.00 for subscribing to creator YouTube channels.",
  },
  {
    id: "earn_twitter_follow",
    title: "Follow on Twitter / X",
    platformName: "twitter",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "accounts you follow on X",
    pathToPage: "/earn/twitter-followers",
    platforms: ["twitter"],
    description: "Earn ₦5.00 for following Twitter / X profiles.",
  },
  {
    id: "earn_twitter_rt",
    title: "Retweet on Twitter / X",
    platformName: "twitter",
    amountToEarn: 8,
    reward: 8,
    whatTheyDo: "tweets you retweet",
    pathToPage: "/earn/twitter-retweets",
    platforms: ["twitter"],
    description: "Earn ₦8.00 for retweeting and quoting campaign tweets on X.",
  },
  {
    id: "earn_fb_follow",
    title: "Follow Facebook Pages",
    platformName: "facebook",
    amountToEarn: 5,
    reward: 5,
    whatTheyDo: "pages you follow on Facebook",
    pathToPage: "/earn/facebook-follows",
    platforms: ["facebook"],
    description: "Earn ₦5.00 for following Facebook brand pages.",
  },
  {
    id: "earn_app_review",
    title: "Download & Review Mobile Apps",
    platformName: "playstore",
    amountToEarn: 25,
    reward: 25,
    whatTheyDo: "apps you review",
    pathToPage: "/earn/playstore-reviews",
    platforms: ["playstore", "applestore"],
    description: "Earn ₦25.00 for downloading mobile apps from PlayStore and writing honest reviews.",
  },
  {
    id: "earn_spotify_stream",
    title: "Listen to Music on Spotify",
    platformName: "spotify",
    amountToEarn: 10,
    reward: 10,
    whatTheyDo: "songs you stream",
    pathToPage: "/earn/spotify-streams",
    platforms: ["spotify", "audiomack"],
    description: "Earn ₦10.00 for streaming songs and following artist profiles on Spotify & Audiomack.",
  },
];

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminData, setAdminData] = useState(defaultAdminData);
  const [advertCreator, setAdvertCreator] = useState(defaultAdvertPackages);
  const [engagementCreator, setEngagementCreator] = useState(defaultEngagementPackages);
  const [advertEarner, setAdvertEarner] = useState(defaultAdvertEarners);
  const [engagementEarner, setEngagementEarner] = useState(defaultEngagementEarners);
  const [loading, setLoading] = useState(true);
  const [dashboardMode, setDashboardModeState] = useState(() => {
    const saved = localStorage.getItem("gigsflix_dashboard_mode");
    if (saved === "retailer" || saved === "advertiser") return "advertiser";
    return "earner";
  });

  const EARNER_ROUTE_PREFIXES = [
    "/earn",
    "/tasks",
    "/workspace",
    "/tasks-history",
    "/withdraw",
  ];

  const ADVERTISER_ROUTE_PREFIXES = [
    "/advertise",
    "/order",
    "/create-task",
    "/creator",
    "/order-history",
    "/fund-wallet",
    "/fundings",
    "/advertisements",
  ];

  const setDashboardMode = (mode) => {
    const validMode = mode === "advertiser" || mode === "retailer" ? "advertiser" : "earner";
    setDashboardModeState(validMode);
    localStorage.setItem("gigsflix_dashboard_mode", validMode);
  };

  const switchDashboardMode = (mode, history, currentPathname) => {
    const validMode = mode === "advertiser" || mode === "retailer" ? "advertiser" : "earner";
    setDashboardModeState(validMode);
    localStorage.setItem("gigsflix_dashboard_mode", validMode);

    const path = currentPathname || (typeof window !== "undefined" ? window.location.pathname : "");
    if (validMode === "advertiser") {
      const isEarnerPage = EARNER_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
      if (isEarnerPage) {
        if (history) {
          history.push("/advertise");
        } else if (typeof window !== "undefined") {
          window.location.href = "/advertise";
        }
      }
    } else {
      const isAdvertiserPage = ADVERTISER_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
      if (isAdvertiserPage) {
        if (history) {
          history.push("/earn");
        } else if (typeof window !== "undefined") {
          window.location.href = "/earn";
        }
      }
    }
  };

  // Fetches current authenticated user profile from Supabase
  const fetchUserData = async () => {
    try {
      const authUser = await authService.getUser();
      if (!authUser) {
        setCurrentUser(null);
        return null;
      }

      let profile = await userService.getProfile(authUser.id, authUser.email);
      
      // If profile doesn't exist yet in the public users table, create it from auth metadata
      if (!profile) {
        const meta = authUser.user_metadata || {};
        profile = await userService.upsertUser({
          id: authUser.id,
          email: authUser.email,
          firstname: meta.firstname || meta.full_name?.split(" ")[0] || "User",
          lastname: meta.lastname || meta.full_name?.split(" ").slice(1).join(" ") || "",
          username: meta.username || authUser.email?.split("@")[0] || "user",
          phone: meta.phone || authUser.phone || "",
          avatar_url: meta.avatar_url || meta.picture || "",
          is_email_verified: true,
          balance: 0,
          pending_balance: 0,
        });
      }

      setCurrentUser(profile);
      return profile;
    } catch (error) {
      console.warn("fetchUserData notice:", error.message);
      return null;
    }
  };

  // Gets admin platform settings
  const getAdminData = async () => {
    try {
      const data = await adminService.getSettings();
      if (data) {
        setAdminData(data);
      }
    } catch (error) {
      setAdminData(defaultAdminData);
    }
  };

  // Gets advert earner packages
  const getAdvertEarners = async () => {
    try {
      const res = await axios.get("/api/v1/earn-tasks/advert");
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setAdvertEarner(res.data.data);
      }
    } catch (error) {
      // Keeps robust fallback
    }
  };

  // Gets engagement earner packages
  const getEngagementEarners = async () => {
    try {
      const res = await axios.get("/api/v1/earn-tasks/engagement");
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setEngagementEarner(res.data.data);
      }
    } catch (error) {
      // Keeps robust fallback
    }
  };

  // Gets creator advert pricing
  const getAdvertCreator = async () => {
    try {
      const res = await axios.get("/api/v1/pricing/adverts");
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setAdvertCreator(res.data.data);
      }
    } catch (error) {
      // Keeps robust fallback
    }
  };

  // Gets creator engagement pricing
  const getEngagementCreator = async () => {
    try {
      const res = await axios.get("/api/v1/pricing/engagement");
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setEngagementCreator(res.data.data);
      }
    } catch (error) {
      // Keeps robust fallback
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await Promise.allSettled([
          fetchUserData(),
          getAdminData(),
          getAdvertEarners(),
          getEngagementEarners(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Direct listener on Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await fetchUserData();
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginUser = async (emailOrUsername, password) => {
    try {
      let targetEmail = emailOrUsername.trim();

      // If user typed a username instead of an email
      if (!targetEmail.includes("@")) {
        const { data: userRow } = await supabase
          .from("users")
          .select("email")
          .eq("username", targetEmail.toLowerCase())
          .maybeSingle();

        if (userRow?.email) {
          targetEmail = userRow.email;
        }
      }

      // 1. Try direct Supabase Auth
      try {
        const data = await authService.signIn({ email: targetEmail, password });
        await fetchUserData();
        return { failed: false, message: "Login successful", user: data.user };
      } catch (supaErr) {
        // 2. Try backend endpoint fallback
        try {
          const res = await axios.post("/api/auth/login", {
            email: targetEmail,
            password,
          });
          if (res.data && !res.data.failed) {
            await fetchUserData();
            return { failed: false, message: "Login successful", user: res.data.user };
          }
        } catch (apiErr) {
          // Re-throw the original clear message
        }
        throw supaErr;
      }
    } catch (error) {
      return { failed: true, message: error.message || "Invalid email or password." };
    }
  };

  const logoutUser = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      return { failed: false, message: "Logged out successfully" };
    } catch (error) {
      return { failed: true, message: error.message || "Failed to log out." };
    }
  };

  const signupUser = async (formData) => {
    try {
      const data = await authService.signUp({
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        phone: formData.phone,
        accountType: formData.accountType,
        referredBy: formData.referredBy,
      });

      if (data?.session) {
        await fetchUserData();
      }
      return {
        failed: false,
        message: data?.session
          ? "Account created successfully."
          : "Account created! Please check your email for the verification code/link.",
        user: data?.user,
        session: data?.session,
        requiresVerification: !data?.session,
      };
    } catch (error) {
      return { failed: true, message: error.message || "Failed to sign up." };
    }
  };

  const OAuthUser = async () => {
    try {
      return await authService.signInWithGoogle();
    } catch (error) {
      console.error("Google OAuth Error:", error);
    }
  };

  const verifyUserEmail = async (email, token, tokenHash, type = "signup") => {
    try {
      const data = await authService.verifyOtp({ email, token, tokenHash, type });
      await fetchUserData();
      return { failed: false, message: "Email verified successfully.", user: data?.user };
    } catch (error) {
      throw new Error(error.message || "Invalid or expired verification code.");
    }
  };

  const resendOTP = async (email, type = "signup") => {
    try {
      await authService.resendVerification({ email, type });
      return { failed: false, message: "Verification code sent to your email." };
    } catch (error) {
      throw new Error(error.message || "Failed to send verification email.");
    }
  };

  const resetUserPassword = async (email) => {
    try {
      await authService.resetPassword(email);
      return { failed: false, message: "Password reset instructions sent to your email." };
    } catch (error) {
      throw new Error(error.message || "Failed to send password reset email.");
    }
  };

  const updateUserPassword = async (newPassword) => {
    try {
      const data = await authService.updatePassword(newPassword);
      return { failed: false, message: "Password updated successfully." };
    } catch (error) {
      throw new Error(error.message || "Failed to update password.");
    }
  };

  const AuthValue = {
    currentUser,
    adminData,
    advertEarner,
    advertCreator,
    engagementEarner,
    engagementCreator,
    fetchUserData,
    loginUser,
    logoutUser,
    signupUser,
    OAuthUser,
    verifyUserEmail,
    resendOTP,
    resetUserPassword,
    updateUserPassword,
    getEngagementEarners,
    getAdvertEarners,
    getEngagementCreator,
    getAdvertCreator,
    getAdminData,
    dashboardMode,
    setDashboardMode,
    switchDashboardMode,
    EARNER_ROUTE_PREFIXES,
    ADVERTISER_ROUTE_PREFIXES,
  };

  return (
    <AuthContext.Provider value={AuthValue}>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-slate-50">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <div className="font-primary min-h-screen bg-slate-50 text-slate-800 antialiased">
          {children}
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
