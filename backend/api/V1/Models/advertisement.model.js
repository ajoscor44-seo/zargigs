import mongoose from "mongoose";
import { deleteFromSupabaseStorage } from "../config/supabase.config.js";

const advertisementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to set the expiresAt field based on createdAt and duration
advertisementSchema.pre("save", function (next) {
  const now = new Date();
  this.expiresAt = new Date(
    now.getTime() + this.duration * 24 * 60 * 60 * 1000
  ); // Convert duration from days to milliseconds
  next();
});

// Create a TTL index on expiresAt field
advertisementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Returns the time left before expiry as part of the data
advertisementSchema.methods.timeLeftInSeconds = function () {
  const now = new Date();
  return (this.expiresAt.getTime() - now.getTime()) / 1000;
};

advertisementSchema.post("remove", async function (doc) {
  const fileUrl = doc.banner;
  if (fileUrl) {
    await deleteFromSupabaseStorage("advertisements", fileUrl);
  }
});

const Advertisement = mongoose.model("advertisement", advertisementSchema);

export default Advertisement;

