import mongoose from "mongoose";
const Schema = mongoose.Schema;

const proofOfWorkSchema = new Schema(
  {
    user: {
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
  },
  {
    timestamps: true,
  }
);

const ProofOfWork = mongoose.model("ProofOfWork", proofOfWorkSchema);

export default ProofOfWork;
