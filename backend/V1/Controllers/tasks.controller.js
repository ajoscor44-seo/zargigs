import AdvertTask from "../Models/advertTask.model.js";
import AllocatedTask from "../Models/allocated-tasks.model.js";
import CancelledTask from "../Models/cancelled-tasks.model.js";
import CompletedTask from "../Models/completed-tasks.model.js";
import EngagementTask from "../Models/engagementTask.js";
import FailedTask from "../Models/failed-tasks.model.js";
import InReviewTask from "../Models/in-review-tasks.model.js";
import PendingTask from "../Models/pending-tasks.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

// Advert task controllers
export const getAdvertTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const advertTask = await AdvertTask.find({ _id: id });
    const adverttask = advertTask.map((advertTask) => {
      const { createdBy, updatedAt, __v, _id, ...rest } = advertTask.toObject();
      return { id: _id, ...rest };
    });
    res.status(200).json(adverttask);
    next();
  } catch (error) {
    next(error);
  }
};

export const getAdvertTasks = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const taskPlatform = req.query.platform || null;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const baseQuery = { createdBy: req.user._id };
    if (taskPlatform) baseQuery.taskPlatform = taskPlatform;
    const advertTasks = await AdvertTask.find(baseQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    const adverttasks = advertTasks.map((advertTask) => {
      const {
        createdBy,
        updatedAt,
        gender,
        location,
        religion,
        caption,
        __v,
        _id,
        ...rest
      } = advertTask.toObject();
      return { id: _id, ...rest };
    });
    const totalCount = await AdvertTask.countDocuments(baseQuery);
    const totalPages = Math.ceil(totalCount / limit);

    const response =
      Number(req.query.limit) > 0
        ? {
            data: adverttasks,
            meta: {
              total: totalCount,
              pages: totalPages,
            },
          }
        : {
            total: totalCount,
            pages: totalPages,
          };
    res.status(200).json(response);
    next();
  } catch (error) {
    next(error);
  }
};

export const postAdvertTask = async (req, res, next) => {
  const {
    title,
    taskType,
    gender,
    location,
    religion,
    caption,
    mediaUrl,
    numberOfTasks,
    costPerTask,
    taskPlatform,
  } = req.body;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    // Create new advert task
    const newAdvertTask = new AdvertTask({
      createdBy: req.user._id,
      taskType,
      taskPlatform,
      gender,
      location,
      religion,
      caption,
      mediaUrl,
      numberOfTasks: Number(numberOfTasks),
      allocatedTasks: 0,
      completedTasks: 0,
      costPerTask: Number(costPerTask),
      status: "pending",
      title,
    });
    await newAdvertTask.save(); // Saves new advert task

    res.status(200).json({
      status: 200,
      failed: false,
      message: "Advert Created successfully.",
    });
    next();
  } catch (error) {
    next(error);
  }
};

// Engagement task controllers
export const getEngagementTask = async (req, res, next) => {
  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    const { id } = req.params;

    const engagementTask = await EngagementTask.find({ _id: id });
    const engagementtask = engagementTask.map((engagementTask) => {
      const { createdBy, updatedAt, __v, _id, ...rest } =
        engagementTask.toObject();
      return { id: _id, ...rest };
    });
    res.status(200).json(engagementtask);
    next();
  } catch (error) {
    next(error);
  }
};

export const getEngagementTasks = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const taskPlatform = req.query.platform || null;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const baseQuery = { createdBy: req.user._id };
    if (taskPlatform) baseQuery.taskPlatform = taskPlatform;

    const engagementTasks = await EngagementTask.find(baseQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const engagementtasks = engagementTasks.map((engagementTask) => {
      const {
        createdBy,
        updatedAt,
        gender,
        location,
        religion,
        caption,
        __v,
        _id,
        ...rest
      } = engagementTask.toObject();
      return { id: _id, ...rest };
    });

    const totalCount = await EngagementTask.countDocuments(baseQuery);
    const totalPages = Math.ceil(totalCount / limit);

    const response =
      Number(req.query.limit) > 0
        ? {
            data: engagementtasks,
            meta: {
              total: totalCount,
              pages: totalPages,
            },
          }
        : {
            total: totalCount,
            pages: totalPages,
          };
    res.status(200).json(response);
    next();
  } catch (error) {
    next(error);
  }
};

export const postEngagementTask = async (req, res, next) => {
  const {
    title,
    taskType,
    gender,
    location,
    religion,
    link,
    numberOfTasks,
    costPerTask,
    taskPlatform,
  } = req.body;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    // Create new engagement task
    const newEngagementTask = new EngagementTask({
      createdBy: req.user._id,
      taskType,
      taskPlatform,
      gender,
      location,
      religion,
      link,
      numberOfTasks: Number(numberOfTasks),
      allocatedTasks: 0,
      completedTasks: 0,
      costPerTask: Number(costPerTask),
      status: "pending",
      title,
    });
    await newEngagementTask.save(); // Saves new engagement task
    res.status(200).json({
      status: 200,
      failed: false,
      message: "Engagement Task Created successfully.",
    });
    next();
  } catch (error) {
    next(error);
  }
};

// Gets task(s) totals
export const getTotalTasks = async (req, res, next) => {
  const taskType = req.query.type || null;
  const taskPlatform = req.query.platform || null;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const baseQuery = {};
    if (taskPlatform) baseQuery.taskPlatform = taskPlatform;
    const Tasks =
      taskType == "advert"
        ? await AdvertTask.find(baseQuery)
        : await EngagementTask.find(baseQuery);

    const tasks = Tasks.map((Task) => {
      const {
        createdBy,
        updatedAt,
        gender,
        location,
        religion,
        caption,
        __v,
        _id,
        ...rest
      } = Task.toObject();
      return { id: _id, ...rest };
    });

    const total = tasks.reduce((total, task) => {
      return total + task.numberOfTasks;
    }, 0);
    const response = { total: total };
    res.status(200).json(response);
    next();
  } catch (error) {
    next(error);
  }
};

// Generates tasks
export const generateTask = async (req, res, next) => {
  const taskType = req.query.type || null;
  const taskPlatform = req.query.platform || null;
  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });
    const taskAllocatedToUser = await AllocatedTask.findOne({
      allocatedTo: req.user._id,
      taskType,
      taskPlatform,
    });

    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    if (!taskPlatform || !taskType) {
      const error = ErrorHandler(400, "Parameters Invalid.");
      return res.status(400).json(error);
    }
    if (taskAllocatedToUser) {
      const error = ErrorHandler(400, "Already generated a task.");
      return res.status(400).json(error);
    }

    const baseQuery = { taskPlatform, taskType };
    const Tasks =
      taskType == "advert"
        ? await AdvertTask.find(baseQuery)
        : await EngagementTask.find(baseQuery);

    const tasks = Tasks.map((Task) => {
      const {
        updatedAt,
        __v,
        _id,
        allocatedTasks,
        numberOfTasks,
        gender,
        location,
        religion,
        ...rest
      } = Task.toObject();

      if (allocatedTasks.length !== numberOfTasks) {
        return {
          id: _id,
          allocatedTasks,
          numberOfTasks,
          ...rest,
        };
      }
    });
    const arrayLength = tasks.length;
    const randomIndex = Math.floor(Math.random() * arrayLength);
    if (!arrayLength) {
      return res.status(404).json({
        message: "No task avalable for this task type.",
        failed: true,
      });
    }
    const Task = tasks[randomIndex];

    // Needs to check something here
    const newAllocatedTask = new AllocatedTask({
      createdBy: Task.createdBy,
      parentId: Task.id,
      allocatedTo: req.user._id,
      taskType: taskType,
      taskPlatform: Task.taskPlatform,
      link: Task.link,
      earningPerTask: Task.costPerTask,
      title: Task.title,
    });
    const newPendingTask = new PendingTask({
      createdBy: Task.createdBy,
      parentId: Task.id,
      toBeDoneBy: req.user._id,
      taskType: taskType,
      taskPlatform: Task.taskPlatform,
      link: Task.link,
      earningPerTask: Task.costPerTask,
      title: Task.title
    });
    await newAllocatedTask.save();
    await newPendingTask.save();

    const taskQuery = { taskPlatform, taskType, _id: Task.id };
    taskType == "advert"
      ? await AdvertTask.findOneAndUpdate(taskQuery, {
          $inc: {
            allocatedTasks: 1,
          },
        })
      : await EngagementTask.findOneAndUpdate(taskQuery, {
          $inc: {
            allocatedTasks: 1,
          },
        });
    const { createdBy, parentId, __v, updatedAt, _id, ...rest } =
      newAllocatedTask.toObject();

    res.status(200).json({ id: _id, ...rest });
    next();
  } catch (error) {
    next(error);
  }
};

// Cancels generated task
export const cancelGeneratedTask = async (req, res, next) => {
  const taskType = req.query.type || null;
  const taskPlatform = req.query.platform || null;
  const taskId = req.query.id || null;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    const taskAllocatedToUser = await AllocatedTask.findOne({
      allocatedTo: req.user._id,
      taskType,
      taskPlatform,
    });
    // Validations
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    if (!taskPlatform || !taskType || !taskId) {
      const error = ErrorHandler(400, "Invalid Parameters.");
      return res.status(400).json(error);
    }
    if (!taskAllocatedToUser) {
      const error = ErrorHandler(400, "Cannot perform this action.");
      return res.status(400).json(error);
    }

    const task = await AllocatedTask.findById(taskId);
    if (!task) {
      const error = ErrorHandler(400, "Invalid Parameters.");
      return res.status(400).json(error);
    }

    const { createdBy, parentId, link, earningPerTask } = task.toObject();
    const newCancelledTask = new CancelledTask({
      createdBy,
      parentId,
      cancelledBy: req.user._id,
      taskType,
      taskPlatform,
      link,
      earningPerTask,
    });
    await newCancelledTask.save();
    await AllocatedTask.findOneAndDelete({ _id: taskId });

    const taskQuery = { taskPlatform, taskType, _id: parentId };
    taskType == "advert"
      ? await AdvertTask.findOneAndUpdate(taskQuery, {
          $inc: {
            allocatedTasks: -1,
          },
        })
      : await EngagementTask.findOneAndUpdate(taskQuery, {
          $inc: {
            allocatedTasks: -1,
          },
        });
    const response = {
      statusCode: 200,
      message: "Task Cancelled Successfully",
      failed: false,
    };
    res.status(200).json(response);
    next();
  } catch (error) {
    next(error);
  }
};

// Get user's tasks list based off the status
export const getTasks = async (req, res, next) => {
  const taskStatus = req.query.status;

  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });

    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    if (!taskStatus) {
      const error = ErrorHandler(400, "Invalid Parameters.");
      return res.status(400).json(error);
    }

    // Not done yet
    const Tasks =
      taskStatus == "allocated"
        ? await AllocatedTask.find({ allocatedTo: req.user._id })
        : taskStatus == "cancelled"
        ? await CancelledTask.find({ cancelledBy: req.user._id })
        : taskStatus == "pending"
        ? await PendingTask.findOne({ toBeDoneBy: req.user._id })
        : taskStatus == "failed"
        ? await FailedTask.find({ doneBy: req.user._id })
        : taskStatus == "completed"
        ? await CompletedTask.find({ doneBy: req.user._id })
        : taskStatus == "in-review"
        ? await InReviewTask.find({ doneBy: req.user._id })
        : [];

    if (!Tasks.length && taskStatus !== "pending") {
      const error = ErrorHandler(404, "No data available.");
      return res.status(404).json(error);
    }

    if (taskStatus !== "pending") {
      const tasks = Tasks.map((Task) => {
        const { updatedAt, __v, _id, ...rest } = Task.toObject();

        return {
          id: _id,
          ...rest,
        };
      });

      // Creates the response
      return res.status(200).json(tasks);
    } else {
      const { updatedAt, __v, _id, ...rest } = Tasks.toObject();
      const currentTime = new Date();
      const expiryTime = Tasks.expireAt;

      const timeLeftMs = expiryTime - currentTime;

      const task = {
        id: _id,
        timeLeftMs,
        ...rest,
      };

      // Creates the response
      return res.status(200).json(task);
    }
  } catch (error) {
    next(error);
  }
};
