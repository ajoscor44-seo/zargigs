import Advertisement from "../Models/advertisement.model.js";
import { processPayment } from "./tasks.controller.js";

export const getAdvertisements = async (req, res, next) => {
  try {
    const advertisements = await Advertisement.find({});

    const formattedAdvertisements = advertisements.map(
      async (advertisement) => {
        const { __v, _id, ...rest } = advertisement.toObject();

        return {
          id: _id,
          ...rest,
        };
      }
    );

    return res
      .status(200)
      .json({ failed: false, data: formattedAdvertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUserAdvertisements = async (req, res, next) => {
  try {
    const advertisements = await Advertisement.find({ postedBy: req.user._id });

    return res.status(200).json({ failed: false, data: advertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllAdvertisements = async (req, res, next) => {
  try {
    const advertisements = await Advertisement.find({});

    return res.status(200).json({ failed: false, data: advertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createAdvertisement = async (req, res, next) => {
  try {
    const { name, link, banner, description, duration } = req.body;
    const paymentResponse = await processPayment(
      Number(duration) * 1500,
      "gigflix advert",
      req.user._id
    );
    if (!paymentResponse.status) {
      return res.status(400).json(paymentResponse);
    }
    const newAdvertisement = new Advertisement({
      name,
      link,
      banner,
      description,
      duration,
      postedBy: req.user._id,
    });
    await newAdvertisement.save();

    return res
      .status(201)
      .json({ failed: false, message: "Advert posted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteAdvertisement = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Advertisement.findByIdAndDelete(id);

    return res.status(200).json({ failed: true, message: "Rest Abeg" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
