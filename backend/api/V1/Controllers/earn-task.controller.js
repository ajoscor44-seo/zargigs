import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";

const defaultEngagementEarners = [
  {
    id: "earn_ig_follow",
    _id: "earn_ig_follow",
    title: "Follow Instagram Account",
    platformName: "instagram",
    amountToEarn: 5,
    reward: 5,
    pathToPage: "/earn/instagram-followers",
    platforms: ["instagram"],
    description: "Earn ₦5.00 for every Instagram account you follow with your profile.",
  },
  {
    id: "earn_ig_like",
    _id: "earn_ig_like",
    title: "Like Instagram Posts",
    platformName: "instagram",
    amountToEarn: 3,
    reward: 3,
    pathToPage: "/earn/instagram-likes",
    platforms: ["instagram"],
    description: "Earn ₦3.00 for liking photos, reels, and carousel posts on Instagram.",
  },
  {
    id: "earn_ig_comment",
    _id: "earn_ig_comment",
    title: "Comment on Instagram Posts",
    platformName: "instagram",
    amountToEarn: 10,
    reward: 10,
    pathToPage: "/earn/instagram-comments",
    platforms: ["instagram"],
    description: "Earn ₦10.00 for posting a relevant comment on sponsored Instagram posts.",
  },
  {
    id: "earn_tiktok_follow",
    _id: "earn_tiktok_follow",
    title: "Follow TikTok Accounts",
    platformName: "tiktok",
    amountToEarn: 5,
    reward: 5,
    pathToPage: "/earn/tiktok-followers",
    platforms: ["tiktok"],
    description: "Earn ₦5.00 for each TikTok account you follow.",
  },
  {
    id: "earn_tiktok_like",
    _id: "earn_tiktok_like",
    title: "Like TikTok Videos",
    platformName: "tiktok",
    amountToEarn: 3,
    reward: 3,
    pathToPage: "/earn/tiktok-likes",
    platforms: ["tiktok"],
    description: "Earn ₦3.00 for liking specified TikTok video links.",
  },
  {
    id: "earn_yt_sub",
    _id: "earn_yt_sub",
    title: "Subscribe to YouTube Channels",
    platformName: "youtube",
    amountToEarn: 15,
    reward: 15,
    pathToPage: "/earn/youtube-subscribers",
    platforms: ["youtube"],
    description: "Earn ₦15.00 for subscribing to creator YouTube channels.",
  },
  {
    id: "earn_twitter_follow",
    _id: "earn_twitter_follow",
    title: "Follow on Twitter / X",
    platformName: "twitter",
    amountToEarn: 5,
    reward: 5,
    pathToPage: "/earn/twitter-followers",
    platforms: ["twitter"],
    description: "Earn ₦5.00 for following Twitter / X profiles.",
  },
  {
    id: "earn_twitter_rt",
    _id: "earn_twitter_rt",
    title: "Retweet on Twitter / X",
    platformName: "twitter",
    amountToEarn: 8,
    reward: 8,
    pathToPage: "/earn/twitter-retweets",
    platforms: ["twitter"],
    description: "Earn ₦8.00 for retweeting and quoting campaign tweets on X.",
  },
  {
    id: "earn_fb_follow",
    _id: "earn_fb_follow",
    title: "Follow Facebook Pages",
    platformName: "facebook",
    amountToEarn: 5,
    reward: 5,
    pathToPage: "/earn/facebook-follows",
    platforms: ["facebook"],
    description: "Earn ₦5.00 for following Facebook brand pages.",
  },
  {
    id: "earn_app_review",
    _id: "earn_app_review",
    title: "Download & Review Mobile Apps",
    platformName: "playstore",
    amountToEarn: 25,
    reward: 25,
    pathToPage: "/earn/playstore-reviews",
    platforms: ["playstore", "applestore"],
    description: "Earn ₦25.00 for downloading mobile apps from PlayStore and writing honest reviews.",
  },
  {
    id: "earn_spotify_stream",
    _id: "earn_spotify_stream",
    title: "Listen to Music on Spotify",
    platformName: "spotify",
    amountToEarn: 10,
    reward: 10,
    pathToPage: "/earn/spotify-streams",
    platforms: ["spotify", "audiomack"],
    description: "Earn ₦10.00 for streaming songs and following artist profiles on Spotify & Audiomack.",
  },
];

const defaultAdvertEarners = [
  {
    id: "earn_adv_whatsapp",
    _id: "earn_adv_whatsapp",
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
    _id: "earn_adv_instagram",
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
    _id: "earn_adv_facebook",
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
    _id: "earn_adv_twitter",
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
    _id: "earn_adv_tiktok",
    title: "Post Adverts on TikTok",
    platformName: "tiktok",
    amountToEarn: 150,
    reward: 150,
    pathToPage: "/earn/tiktok-post",
    platforms: ["tiktok"],
    description: "Earn ₦150.00 by uploading sponsored sound tracks and videos on TikTok.",
  },
];

export const getAdvertEarners = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from("earn_advert_config")
      .select("*", { count: "exact" })
      .range(from, to);

    let formatted = [];
    if (!error && data && data.length > 0) {
      formatted = data.map((item) => {
        const titleLower = (item.title || "").toLowerCase();
        const platformName =
          item.platform_name ||
          (titleLower.includes("whatsapp")
            ? "whatsapp"
            : titleLower.includes("instagram")
            ? "instagram"
            : titleLower.includes("facebook")
            ? "facebook"
            : titleLower.includes("twitter")
            ? "twitter"
            : "tiktok");

        return {
          id: item.id,
          _id: item.id,
          title: item.title,
          platformName,
          pathToPage: item.path_to_page,
          amountToEarn: Number(item.reward || item.amount_to_earn || 100),
          reward: Number(item.reward || 100),
          platforms: item.platforms || [platformName],
          description: item.description,
        };
      });
    } else {
      formatted = defaultAdvertEarners;
    }

    const totalCount = count || formatted.length;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: formatted,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdvertEarners = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("earn_advert_config").select("*");
    let formatted = [];

    if (!error && data && data.length > 0) {
      formatted = data.map((item) => {
        const titleLower = (item.title || "").toLowerCase();
        const platformName =
          item.platform_name ||
          (titleLower.includes("whatsapp")
            ? "whatsapp"
            : titleLower.includes("instagram")
            ? "instagram"
            : titleLower.includes("facebook")
            ? "facebook"
            : titleLower.includes("twitter")
            ? "twitter"
            : "tiktok");

        return {
          id: item.id,
          _id: item.id,
          title: item.title,
          platformName,
          pathToPage: item.path_to_page,
          amountToEarn: Number(item.reward || item.amount_to_earn || 100),
          reward: Number(item.reward || 100),
          platforms: item.platforms || [platformName],
          description: item.description,
        };
      });
    } else {
      formatted = defaultAdvertEarners;
    }

    return res.status(200).json({
      failed: false,
      data: formatted,
      message: "Advert tasks fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const postAdvertEarner = async (req, res, next) => {
  try {
    const { title, pathToPage, reward, description } = req.body;
    const { data, error } = await supabase
      .from("earn_advert_config")
      .insert({ title, path_to_page: pathToPage, reward, description })
      .select()
      .single();
    if (error) throw error;
    return res.status(201).json({ failed: false, data });
  } catch (error) {
    next(error);
  }
};

export const updateAdvertEarner = async (req, res, next) => {
  try {
    const { id: earnerId, amount } = req.query;
    const { data, error } = await supabase
      .from("earn_advert_config")
      .update({ reward: amount })
      .eq("id", earnerId)
      .select()
      .single();

    if (error) {
      const err = ErrorHandler(404, "Pricing way not found");
      return res.status(404).json(err);
    }

    return res.status(200).json({ failed: false, message: "Amount Updated" });
  } catch (error) {
    next(error);
  }
};

export const getEngagementEarners = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from("earn_engagement_config")
      .select("*", { count: "exact" })
      .range(from, to);

    let formatted = [];
    if (!error && data && data.length > 0) {
      formatted = data.map((item) => {
        const titleLower = (item.title || "").toLowerCase();
        const platformName =
          item.platform_name ||
          (titleLower.includes("instagram")
            ? "instagram"
            : titleLower.includes("tiktok")
            ? "tiktok"
            : titleLower.includes("youtube")
            ? "youtube"
            : titleLower.includes("twitter") || titleLower.includes("x")
            ? "twitter"
            : titleLower.includes("facebook")
            ? "facebook"
            : titleLower.includes("playstore") || titleLower.includes("app")
            ? "playstore"
            : titleLower.includes("spotify")
            ? "spotify"
            : "website");

        return {
          id: item.id,
          _id: item.id,
          title: item.title,
          platformName,
          pathToPage: item.path_to_page,
          amountToEarn: Number(item.reward || item.amount_to_earn || 5),
          reward: Number(item.reward || 5),
          platforms: item.platforms || [platformName],
          description: item.description,
        };
      });
    } else {
      formatted = defaultEngagementEarners;
    }

    const totalCount = count || formatted.length;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      failed: false,
      data: formatted,
      meta: {
        total: totalCount,
        pages: totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEngagementEarners = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("earn_engagement_config").select("*");
    let formatted = [];

    if (!error && data && data.length > 0) {
      formatted = data.map((item) => {
        const titleLower = (item.title || "").toLowerCase();
        const platformName =
          item.platform_name ||
          (titleLower.includes("instagram")
            ? "instagram"
            : titleLower.includes("tiktok")
            ? "tiktok"
            : titleLower.includes("youtube")
            ? "youtube"
            : titleLower.includes("twitter") || titleLower.includes("x")
            ? "twitter"
            : titleLower.includes("facebook")
            ? "facebook"
            : titleLower.includes("playstore") || titleLower.includes("app")
            ? "playstore"
            : titleLower.includes("spotify")
            ? "spotify"
            : "website");

        return {
          id: item.id,
          _id: item.id,
          title: item.title,
          platformName,
          pathToPage: item.path_to_page,
          amountToEarn: Number(item.reward || item.amount_to_earn || 5),
          reward: Number(item.reward || 5),
          platforms: item.platforms || [platformName],
          description: item.description,
        };
      });
    } else {
      formatted = defaultEngagementEarners;
    }

    return res.status(200).json({
      failed: false,
      data: formatted,
      message: "Engagement tasks fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const postEngagementEarner = async (req, res, next) => {
  try {
    const { title, pathToPage, reward, description } = req.body;
    const { data, error } = await supabase
      .from("earn_engagement_config")
      .insert({ title, path_to_page: pathToPage, reward, description })
      .select()
      .single();
    if (error) throw error;
    return res.status(201).json({ failed: false, data });
  } catch (error) {
    next(error);
  }
};

export const updateEngagementEarner = async (req, res, next) => {
  try {
    const { id: earnerId, amount } = req.query;
    const { data, error } = await supabase
      .from("earn_engagement_config")
      .update({ reward: amount })
      .eq("id", earnerId)
      .select()
      .single();

    if (error) {
      const err = ErrorHandler(404, "Pricing way not found");
      return res.status(404).json(err);
    }

    return res.status(200).json({ failed: false, message: "Amount Updated" });
  } catch (error) {
    next(error);
  }
};
