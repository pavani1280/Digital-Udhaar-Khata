import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect route to ensure authenticated request
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretjwtkeyforudhaarkhata123!");

      // Get user from token and exclude password
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check account status
      if (user.status === "inactive") {
        return res.status(403).json({ message: "Account deactivated. Please contact support." });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Authorize roles (admin, shopkeeper)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user ? req.user.role : "none"}) is not authorized to access this resource`
      });
    }
    next();
  };
};
