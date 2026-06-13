import User from "../models/User.js";
import Settings from "../models/Settings.js";
import jwt from "jsonwebtoken";

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretjwtkeyforudhaarkhata123!", {
    expiresIn: "30d"
  });
};

// Register user
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, shopName, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create user. Pre-save hook will hash password.
    const user = await User.create({
      name,
      email,
      password,
      shopName,
      phone,
      role: "shopkeeper"
    });

    // Automatically create default settings for the user
    await Settings.create({
      userId: user._id
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      shopName: user.shopName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ message: "Your account is deactivated. Please contact support." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      shopName: user.shopName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// Get profile details
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update profile details
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.shopName = req.body.shopName || user.shopName;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password; // pre-save hook will hash it
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        shopName: updatedUser.shopName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};
