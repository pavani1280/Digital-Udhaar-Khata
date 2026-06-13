import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    shopkeeperId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["credit", "payment"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

export default model("Transaction", transactionSchema);
