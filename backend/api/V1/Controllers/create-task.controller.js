import { supabase } from "../config/supabase.config.js";
import { ErrorHandler } from "../utils/error.js";

const defaultEngagementCreators = [
  {
    id: "eng_ig_follow",
    _id: "eng_ig_follow",
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
    _id: "eng_ig_like",
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
    _id: "eng_ig_comment",
    title: "Get Custom Instagram Comments",
    platformName: "instagram",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/instagram-comments",
    platforms: ["instagram"],
    description: "Get meaningful, relevant custom comments on your Instagram posts to drive conversation.",
  },
  {
    id: "eng_tiktok_follow",
    _id: "eng_tiktok_follow",
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
    _id: "eng_tiktok_like",
    title: "Get TikTok Video Likes",
    platformName: "tiktok",
    amountToPay: 6,
    amountToEarn: 3,
    pathToPage: "/order/tiktok-likes",
    platforms: ["tiktok"],
    description: "Trigger the TikTok FYP algorithm by getting real user likes on your videos.",
  },
  {
    id: "eng_yt_sub",
    _id: "eng_yt_sub",
    title: "Get YouTube Subscribers",
    platformName: "youtube",
    amountToPay: 30,
    amountToEarn: 15,
    pathToPage: "/order/youtube-subscribers",
    platforms: ["youtube"],
    description: "Gain genuine channel subscribers to accelerate your YouTube monetization.",
  },
  {
    id: "eng_yt_like",
    _id: "eng_yt_like",
    title: "Get YouTube Video Likes",
    platformName: "youtube",
    amountToPay: 15,
    amountToEarn: 8,
    pathToPage: "/order/youtube-likes",
    platforms: ["youtube"],
    description: "Increase video rankings and engagement metrics on YouTube.",
  },
  {
    id: "eng_twitter_follow",
    _id: "eng_twitter_follow",
    title: "Get Twitter / X Followers",
    platformName: "twitter",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/twitter-followers",
    platforms: ["twitter"],
    description: "Build social proof and authority on X (Twitter) with real followers.",
  },
  {
    id: "eng_twitter_rt",
    _id: "eng_twitter_rt",
    title: "Get Twitter / X Retweets & Quotes",
    platformName: "twitter",
    amountToPay: 15,
    amountToEarn: 8,
    pathToPage: "/order/twitter-retweets",
    platforms: ["twitter"],
    description: "Amplify your message across Nigerian Twitter with genuine retweets and quotes.",
  },
  {
    id: "eng_fb_follow",
    _id: "eng_fb_follow",
    title: "Get Facebook Page Followers",
    platformName: "facebook",
    amountToPay: 10,
    amountToEarn: 5,
    pathToPage: "/order/facebook-follows",
    platforms: ["facebook"],
    description: "Increase follower count and credibility for your Facebook page.",
  },
  {
    id: "eng_app_review",
    _id: "eng_app_review",
    title: "Download & Review Mobile App",
    platformName: "playstore",
    amountToPay: 50,
    amountToEarn: 25,
    pathToPage: "/order/playstore-reviews",
    platforms: ["playstore", "applestore"],
    description: "Get real users to download your Android or iOS app and leave positive reviews.",
  },
  {
    id: "eng_spotify_stream",
    _id: "eng_spotify_stream",
    title: "Spotify & Music Streams / Follows",
    platformName: "spotify",
    amountToPay: 20,
    amountToEarn: 10,
    pathToPage: "/order/spotify-streams",
    platforms: ["spotify", "audiomack"],
    description: "Boost your song stream count and artist profile saves across music platforms.",
  },
];

const defaultAdvertCreators = [
  {
    id: "adv_whatsapp",
    _id: "adv_whatsapp",
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
    _id: "adv_instagram",
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
    _id: "adv_facebook",
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
    _id: "adv_twitter",
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
    _id: "adv_tiktok",
    title: "Post Advert on TikTok",
    platformName: "tiktok",
    amountToPay: 250,
    amountToEarn: 150,
    pathToPage: "/advertise/tiktok-post",
    platforms: ["tiktok"],
    description: "Pay creators to post your promotional video or audio on TikTok.",
  },
];

export const getAdvertCreators = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from("create_advert_config")
      .select("*", { count: "exact" })
      .range(from, to);

    let formatted = [];
    if (!error && data && data.length > 0) {
      formatted = data.map((item) => ({
        id: item.id,
        _id: item.id,
        title: item.title,
        platformName: item.platform_name || item.title?.toLowerCase().includes("whatsapp") ? "whatsapp" : item.title?.toLowerCase().includes("instagram") ? "instagram" : item.title?.toLowerCase().includes("facebook") ? "facebook" : item.title?.toLowerCase().includes("twitter") ? "twitter" : "tiktok",
        pathToPage: item.path_to_page,
        amountToPay: Number(item.price || item.amount_to_pay || 150),
        price: Number(item.price || 150),
        amountToEarn: Number(item.amount_to_earn || 100),
        platforms: item.platforms || [item.platform_name || "whatsapp"],
        description: item.description,
        fee: item.fee || 0,
      }));
    } else {
      formatted = defaultAdvertCreators;
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

export const getAllAdvertCreators = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("create_advert_config").select("*");
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
          amountToPay: Number(item.price || item.amount_to_pay || 150),
          price: Number(item.price || 150),
          amountToEarn: Number(item.amount_to_earn || 100),
          platforms: item.platforms || [platformName],
          description: item.description,
          fee: item.fee || 0,
        };
      });
    } else {
      formatted = defaultAdvertCreators;
    }

    return res.status(200).json({
      failed: false,
      data: formatted,
      message: "Advert creator fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const postAdvertCreator = async (req, res, next) => {
  try {
    const { title, pathToPage, price, description, fee, platformName, amountToPay, amountToEarn, platforms } = req.body;
    const { data, error } = await supabase
      .from("create_advert_config")
      .insert({
        title,
        path_to_page: pathToPage,
        price: price || amountToPay,
        description,
        fee,
      })
      .select()
      .single();
    if (error) throw error;
    return res.status(201).json({ failed: false, data });
  } catch (error) {
    next(error);
  }
};

export const updateAdvertCreator = async (req, res, next) => {
  try {
    const { id: creatorId, amount } = req.query;
    const { data, error } = await supabase
      .from("create_advert_config")
      .update({ price: amount })
      .eq("id", creatorId)
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

export const getEngagementCreators = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from("create_engagement_config")
      .select("*", { count: "exact" })
      .range(from, to);

    let formatted = [];
    if (!error && data && data.length > 0) {
      formatted = data.map((item) => ({
        id: item.id,
        _id: item.id,
        title: item.title,
        platformName: item.platform_name || (item.title?.toLowerCase().includes("instagram") ? "instagram" : item.title?.toLowerCase().includes("tiktok") ? "tiktok" : item.title?.toLowerCase().includes("youtube") ? "youtube" : item.title?.toLowerCase().includes("twitter") ? "twitter" : item.title?.toLowerCase().includes("facebook") ? "facebook" : item.title?.toLowerCase().includes("playstore") ? "playstore" : "spotify"),
        pathToPage: item.path_to_page,
        amountToPay: Number(item.price || item.amount_to_pay || 10),
        price: Number(item.price || 10),
        amountToEarn: Number(item.amount_to_earn || 5),
        platforms: item.platforms || ["website"],
        description: item.description,
        fee: item.fee || 0,
      }));
    } else {
      formatted = defaultEngagementCreators;
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

export const getAllEngagementCreators = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("create_engagement_config").select("*");
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
          amountToPay: Number(item.price || item.amount_to_pay || 10),
          price: Number(item.price || 10),
          amountToEarn: Number(item.amount_to_earn || 5),
          platforms: item.platforms || [platformName],
          description: item.description,
          fee: item.fee || 0,
        };
      });
    } else {
      formatted = defaultEngagementCreators;
    }

    return res.status(200).json({
      failed: false,
      data: formatted,
      message: "Engagement task creators fetched successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const postEngagementCreator = async (req, res, next) => {
  try {
    const { title, pathToPage, price, description, fee, platformName, amountToPay } = req.body;
    const { data, error } = await supabase
      .from("create_engagement_config")
      .insert({
        title,
        path_to_page: pathToPage,
        price: price || amountToPay,
        description,
        fee,
      })
      .select()
      .single();
    if (error) throw error;
    return res.status(201).json({ failed: false, data });
  } catch (error) {
    next(error);
  }
};

export const updateEngagementCreator = async (req, res, next) => {
  try {
    const { id: creatorId, amount } = req.query;
    const { data, error } = await supabase
      .from("create_engagement_config")
      .update({ price: amount })
      .eq("id", creatorId)
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

