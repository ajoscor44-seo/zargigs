import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roleId: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
