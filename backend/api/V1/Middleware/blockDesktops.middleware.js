const blockDesktopsMiddleware = (req, res, next) => {
  const source = req.useragent;

  if (source.isDesktop) {
    return res
      .status(403)
      .json({ message: "Access denied for desktop devices." });
  }

  next();
};

export default blockDesktopsMiddleware;
