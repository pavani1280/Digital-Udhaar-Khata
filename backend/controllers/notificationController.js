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

// Generate an AI-powered custom reminder message using Gemini
export const generateAIReminder = async (req, res, next) => {
  try {
    const { customerId, tone } = req.body;
    const userId = req.user._id;

    if (!["friendly", "professional", "urgent"].includes(tone)) {
      return res.status(400).json({ message: "Invalid tone value. Must be 'friendly', 'professional', or 'urgent'." });
    }

    // Fetch customer details
    const customer = await Customer.findOne({ _id: customerId, shopkeeperId: userId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch user settings
    let settings = await Settings.findOne({ userId });
    const currencySymbol = settings?.currency === "INR" ? "₹" : settings?.currency === "USD" ? "$" : (settings?.currency || "₹");
    const shopName = req.user.shopName || "our shop";
    const balance = customer.balance;

    let aiMessage = "";

    // Check if Gemini API key exists
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Write a short, engaging, and personalized payment reminder message for a customer of a shop. The customer's name is ${customer.name}, outstanding balance is ${currencySymbol}${balance}, and the shop name is ${shopName}. The tone should be ${tone}. Keep it within 200 characters so it can be sent via SMS or WhatsApp. Do not include any email subject lines, greeting salutations other than the name, or quotation marks. Output only the message text itself.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          let txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt) {
            aiMessage = txt.trim().replace(/^["']|["']$/g, ""); // clean wrapping quotes if AI outputs them
          }
        }
      } catch (aiErr) {
        console.error("Gemini API call failed, falling back to heuristics:", aiErr);
      }
    }

    // Heuristics fallback if Gemini failed or API key was missing
    if (!aiMessage) {
      if (tone === "friendly") {
        aiMessage = `Hi ${customer.name}! Hope you are doing well. Just a gentle reminder from ${shopName} regarding your outstanding balance of ${currencySymbol}${balance}. Thank you!`;
      } else if (tone === "urgent") {
        aiMessage = `URGENT: Dear ${customer.name}, your outstanding balance of ${currencySymbol}${balance} at ${shopName} is overdue. Please settle this payment immediately. Thank you.`;
      } else {
        aiMessage = `Dear ${customer.name}, this is a reminder from ${shopName} that your outstanding balance of ${currencySymbol}${balance} is due. Please clear it at your convenience. Thank you.`;
      }
    }

    // Auto-create notification record
    await Notification.create({
      userId,
      customerId,
      message: `Generated AI (${tone}) reminder for ${customer.name}: "${aiMessage}"`,
      type: "due_reminder"
    });

    res.json({
      success: true,
      formattedMessage: aiMessage,
      recipientPhone: customer.phone
    });
  } catch (error) {
    next(error);
  }
};
