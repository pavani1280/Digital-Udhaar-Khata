import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

// Admin: Get all registered users (shopkeepers)
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    let query = { role: { $ne: "admin" } }; // Admin shouldn't manage/toggle other admins generally, list shopkeepers

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { shopName: { $regex: search, $options: "i" } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Admin: Activate or deactivate a shopkeeper account
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value. Must be 'active' or 'inactive'." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status} successfully`, user });
  } catch (error) {
    next(error);
  }
};

// Admin: Get platform-wide analytics/statistics
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalShopkeepers = await User.countDocuments({ role: "shopkeeper" });
    const activeShopkeepers = await User.countDocuments({ role: "shopkeeper", status: "active" });
    const inactiveShopkeepers = await User.countDocuments({ role: "shopkeeper", status: "inactive" });
    const totalCustomers = await Customer.countDocuments({});

    // Aggregate overall transactions
    const transactionStats = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalCreditGiven = 0;
    let totalCreditCount = 0;
    let totalAmountCollected = 0;
    let totalPaymentCount = 0;

    transactionStats.forEach((stat) => {
      if (stat._id === "credit") {
        totalCreditGiven = stat.totalAmount;
        totalCreditCount = stat.count;
      } else if (stat._id === "payment") {
        totalAmountCollected = stat.totalAmount;
        totalPaymentCount = stat.count;
      }
    });

    // Recent shopkeepers registered
    const recentShopkeepers = await User.find({ role: "shopkeeper" })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      shopkeepers: {
        total: totalShopkeepers,
        active: activeShopkeepers,
        inactive: inactiveShopkeepers
      },
      totalCustomers,
      transactions: {
        creditGiven: totalCreditGiven,
        creditCount: totalCreditCount,
        amountCollected: totalAmountCollected,
        paymentCount: totalPaymentCount,
        pendingAmount: totalCreditGiven - totalAmountCollected
      },
      recentShopkeepers
    });
  } catch (error) {
    next(error);
  }
};
