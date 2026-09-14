const blockDesktopsMiddleware = (req, res, next) => {
  // Allow all devices (desktop and mobile)
  next();
};

export default blockDesktopsMiddleware;
