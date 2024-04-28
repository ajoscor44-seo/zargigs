import mongoose from "mongoose";
const Schema = mongoose.Schema;

const proofOfWorkSchema = new Schema(
  {
    createdBy: {
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
  },
  {
    timestamps: true,
  }
);

const ProofOfWork = mongoose.model("ProofOfWork", proofOfWorkSchema);

export default ProofOfWork;
