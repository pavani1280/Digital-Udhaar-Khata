import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    duePeriodDays: {
      type: Number,
      default: 30
    },
    whatsappReminderTemplate: {
      type: String,
      default: "Hello {customerName}, this is a friendly reminder that you have a pending balance of {currency} {balance} at {shopName}. Please clear it soon. Thank you!"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

export default model("Settings", settingsSchema);
