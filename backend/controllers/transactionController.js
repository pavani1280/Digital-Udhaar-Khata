import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";
import mongoose from "mongoose";

// Add a transaction (Credit or Payment)
export const createTransaction = async (req, res, next) => {
  try {
    const { customerId, type, amount, description, date } = req.body;
    const shopkeeperId = req.user._id;

    // Check if customer exists
    const customer = await Customer.findOne({ _id: customerId, shopkeeperId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Create transaction
    const transaction = await Transaction.create({
      customerId,
      shopkeeperId,
      type,
      amount: Number(amount),
      description: description || "",
      date: date ? new Date(date) : new Date()
    });

    // Update Customer's balance atomically
    const balanceIncrement = type === "credit" ? Number(amount) : -Number(amount);
    customer.balance += balanceIncrement;
    await customer.save();

    res.status(201).json({
      transaction,
      updatedBalance: customer.balance
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve transactions list with filtering options
export const getTransactions = async (req, res, next) => {
  try {
    const shopkeeperId = req.user._id;
    const { customerId, type, startDate, endDate, limit } = req.query;

    let query = { shopkeeperId };

    if (customerId) {
      query.customerId = customerId;
    }

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        // Start of day
        query.date.$gte = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      }
      if (endDate) {
        // End of day
        query.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      }
    }

    const transactions = await Transaction.find(query)
      .populate("customerId", "name phone")
      .sort({ date: -1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// Get Shopkeeper transaction summary stats (Credits vs Collection)
export const getShopkeeperStats = async (req, res, next) => {
  try {
    const shopkeeperId = req.user._id;

    // Aggregate statistics
    const stats = await Transaction.aggregate([
      { $match: { shopkeeperId: new mongoose.Types.ObjectId(shopkeeperId) } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    let totalCredit = 0;
    let totalCollected = 0;

    stats.forEach((s) => {
      if (s._id === "credit") totalCredit = s.totalAmount;
      if (s._id === "payment") totalCollected = s.totalAmount;
    });

    const totalCustomers = await Customer.countDocuments({ shopkeeperId });

    res.json({
      totalCredit,
      totalCollected,
      pendingBalance: totalCredit - totalCollected,
      totalCustomers
    });
  } catch (error) {
    next(error);
  }
};

// Get daily growth analytics (Credit vs Payments)
export const getMonthlyReport = async (req, res, next) => {
  try {
    const shopkeeperId = req.user._id;

    // Run aggregation to group by year/month/day
    const reports = await Transaction.aggregate([
      { $match: { shopkeeperId: new mongoose.Types.ObjectId(shopkeeperId) } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          credit: {
            $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] }
          },
          payment: {
            $sum: { $cond: [{ $eq: ["$type", "payment"] }, "$amount", 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          day: "$_id.day",
          credit: 1,
          payment: 1
        }
      },
      { $sort: { year: 1, month: 1, day: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedReports = reports.map((r) => ({
      name: `${String(r.day).padStart(2, "0")} ${monthNames[r.month - 1]}`,
      credit: r.credit,
      payment: r.payment,
      balance: r.credit - r.payment
    }));

    res.json(formattedReports);
  } catch (error) {
    next(error);
  }
};
