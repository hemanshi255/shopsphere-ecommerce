const jwt = require("jsonwebtoken");

const adminOnly = (req, res, next) => {

  if (req.user && req.user.role === "admin") {

    next();

  } else {

    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });

  }

};

const protect = (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
};

module.exports = {
  protect,
  adminOnly,
};