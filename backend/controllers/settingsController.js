import Settings from "../models/Settings.js";

// Fetch settings for the logged-in shopkeeper
export const getSettings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let settings = await Settings.findOne({ userId });

    // If settings don't exist yet, create defaults
    if (!settings) {
      settings = await Settings.create({ userId });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Update settings
export const updateSettings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { currency, duePeriodDays, whatsappReminderTemplate } = req.body;

    let settings = await Settings.findOne({ userId });

    if (!settings) {
      settings = new Settings({ userId });
    }

    if (currency) settings.currency = currency;
    if (duePeriodDays !== undefined) settings.duePeriodDays = duePeriodDays;
    if (whatsappReminderTemplate) settings.whatsappReminderTemplate = whatsappReminderTemplate;

    await settings.save();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
