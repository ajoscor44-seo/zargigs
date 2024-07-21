import Advertisement from "../Models/advertisement.model.js";

export const getAdvertisements = (req, res, next) => {
  try {
    const advertisements = Advertisement.find({});

    const formattedAdvertisements = advertisements.map((advertisement) => {
      const { name } = advertisement.toObject();

      return {
        name,
      };
    });

    return res
      .status(200)
      .json({ failed: true, data: formattedAdvertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUserAdvertisements = (req, res, next) => {
  try {
    const advertisements = Advertisement.find({});

    return res.status(200).json({ failed: true, data: advertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllAdvertisements = (req, res, next) => {
  try {
    const advertisements = Advertisement.find({});

    return res.status(200).json({ failed: true, data: advertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createAdvertisement = (req, res, next) => {
  try {
    const advertisements = Advertisement.find({});

    return res.status(200).json({ failed: true, data: advertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteAdvertisement = (req, res, next) => {
  try {
    const advertisements = Advertisement.find({});

    return res.status(200).json({ failed: true, data: advertisements });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
