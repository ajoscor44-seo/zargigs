import mongoose from "mongoose";
const Schema = mongoose.Schema;

const proofOfWorkSchema = new Schema(
  {
    createdBy: {
      type: String,
      required: true,
    },
    grandParentId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    taskPlatform: {
      type: String,
      required: true,
    },
    requestFrom: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const ProofOfWork = mongoose.model("ProofOfWork", proofOfWorkSchema);

export default ProofOfWork;
