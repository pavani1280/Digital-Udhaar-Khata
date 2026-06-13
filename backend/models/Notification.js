import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer"
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["due_reminder", "system"],
      default: "due_reminder"
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

export default model("Notification", notificationSchema);
