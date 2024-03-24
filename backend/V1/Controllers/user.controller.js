export const getUser = async (req, res, next) => {
  res.json(req.user);
  next();
};
