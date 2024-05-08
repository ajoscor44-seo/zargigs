import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      required: true,
    },
    announcement: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
