import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
