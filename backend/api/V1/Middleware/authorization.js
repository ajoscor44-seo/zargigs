const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Continue if the user is an admin
  } else {
    res.status(403).json({
      message: "Access denied!. You do not have access to this endpoint.",
    });
  }
};

export default authorizeAdmin;
