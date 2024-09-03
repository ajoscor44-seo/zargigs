import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
    },
    expirationTime: {
      type: Date,
      default: null,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

subscriptionSchema.index({ userId: 1 });

export default Subscription;
