import { sanction } from "../Controllers/tasks.controller.js";
import InReviewTask from "../Models/in-review-tasks.model.js";
import ProofOfWork from "../Models/proof-of-work.model.js";
import logger from "./logger.util.js";

const approveTasks = async () => {
  try {
    const now = new Date();
    const tasks = await InReviewTask.find({
      createdAt: { $lt: new Date(now - 24 * 60 * 60 * 1000) },
    });

    for (const task of tasks) {
      const proofOfWork = await ProofOfWork.findOne({ parentId: task._id });
      if (!proofOfWork) {
        logger.info(`No proof of work for this task: ${task._id}`);
        continue;
      }
      await sanction(proofOfWork._id, 1, task._id, task.createdBy);
      logger.info(
        `Task ${task._id}, done by ${task.doneBy}, approved automatically after 24 hours`
      );
    }
  } catch (err) {
    logger.error("Failed to automatically approve task with bull:", err);
  }
};

export default approveTasks;
