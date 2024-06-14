const blockDesktopsMiddleware = (req, res, next) => {
  const source = req.useragent;
  const origin = req.get("origin") || req.get("referer");

  // Check if the request is from https://app.gigsflix.com and from a desktop device
  if (origin && origin.includes("app.gigsflix.com") && source.isDesktop) {
    return res
      .status(403)
      .json({ message: "Access denied for desktop devices." });
  }

  if (origin && origin.includes("admin.gigsflix.com") && !source.isDesktop) {
    return res
      .status(403)
      .json({ message: "Access denied for non-desktop devices." });
  }

  next();
};

export default blockDesktopsMiddleware;
