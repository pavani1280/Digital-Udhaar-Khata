import Notification from "../models/Notification.js";
import Customer from "../models/Customer.js";
import Settings from "../models/Settings.js";

// Fetch notifications for the logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .populate("customerId", "name phone")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    next(error);
  }
};

// Generate and format a ready-to-send SMS/WhatsApp message
export const getReminderMessage = async (req, res, next) => {
  try {
    const { customerId } = req.body;
    const userId = req.user._id;

    // Fetch customer details
    const customer = await Customer.findOne({ _id: customerId, shopkeeperId: userId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch user settings
    let settings = await Settings.findOne({ userId });
    if (!settings) {
      settings = await Settings.create({ userId });
    }

    // Populate the template
    // Template placeholder variables: {customerName}, {currency}, {balance}, {shopName}
    let template = settings.whatsappReminderTemplate;
    const currencySymbol = settings.currency === "INR" ? "₹" : settings.currency === "USD" ? "$" : settings.currency;

    let message = template
      .replace(/{customerName}/g, customer.name)
      .replace(/{currency}/g, currencySymbol)
      .replace(/{balance}/g, customer.balance)
      .replace(/{shopName}/g, req.user.shopName);

    // Auto-create an in-app reminder history notification
    await Notification.create({
      userId,
      customerId,
      message: `Generated reminder for ${customer.name}: "${message}"`,
      type: "due_reminder"
    });

    res.json({
      success: true,
      formattedMessage: message,
      recipientPhone: customer.phone
    });
  } catch (error) {
    next(error);
  }
};
