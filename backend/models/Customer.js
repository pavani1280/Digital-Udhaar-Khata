import { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    shopkeeperId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

export default model("Customer", customerSchema);
