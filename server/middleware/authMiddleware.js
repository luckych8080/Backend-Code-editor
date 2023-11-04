require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateRole(role) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token not provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Error in authentication middleware:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token not provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, authenticateRole };
