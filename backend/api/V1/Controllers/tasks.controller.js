import numeral from "numeral";
import AdvertTask from "../Models/advertTask.model.js";
import AllocatedTask from "../Models/allocated-tasks.model.js";
import CancelledTask from "../Models/cancelled-tasks.model.js";
import CompletedTask from "../Models/completed-tasks.model.js";
import EngagementTask from "../Models/engagementTask.js";
import FailedTask from "../Models/failed-tasks.model.js";
import InReviewTask from "../Models/in-review-tasks.model.js";
import PendingTask from "../Models/pending-tasks.model.js";
import ProofOfWork from "../Models/proof-of-work.model.js";
import userDetails from "../Models/user-details.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import {
  sendNotitfication,
  sendPushNotification,
} from "../utils/notification.js";
import logger from "../utils/logger.util.js";
import EarnEngagement from "../Models/earn-engagement.model.js";
import CreateEngagement from "../Models/create-engagement.model.js";
import EarnAdvert from "../Models/earn-advert.model.js";
import CreateAdvert from "../Models/create-advert.model.js";

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
      const { createdBy, updatedAt, __v, _id, status, ...rest } =
        advertTask.toObject();
      return { id: _id, ...rest };
    });
    res.status(200).json(adverttask);
    next();
  } catch (error) {
    console.log(error);
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
      .sort({ createdAt: -1 })
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
        status,
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
    earnId,
    payId,
    title,
    taskType,
    gender,
    location,
    religion,
    caption,
    mediaUrl,
    numberOfTasks,
    taskPlatform,
  } = req.body;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const earnAdvert = await EarnAdvert.findById(earnId);
    const { amountToEarn } = earnAdvert.toObject();
    const createAdvert = await CreateAdvert.findById(payId);
    const { amountToPay } = createAdvert.toObject();
    const paymentResponse = await processPayment(
      Number(numberOfTasks) * Number(amountToPay),
      taskType,
      req.user._id
    );
    if (!paymentResponse.status) {
      return res.status(400).json(paymentResponse);
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
      costPerTask: Number(amountToPay),
      earningPerTask: Number(amountToEarn),
      status: "pending",
      title,
    });
    await newAdvertTask.save();

    const notification = {
      title: "New Task Created!",
      body: "A new advert task has just been posted rush in now to claim your earning!.",
      icon: "./gigsflix_logo_white.png",
      data: {
        url: `${
          process.env.NODE_ENV === "development"
            ? process.env.DEV_CLIENT_URL
            : process.env.PROD_CLIENT_URL
        }/earn`,
      },
    };

    await sendPushNotification(notification);

    res.status(200).json({
      status: 200,
      failed: false,
      message: "Advert Created successfully.",
    });
    next();
  } catch (error) {
    console.log(error);
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
      const { createdBy, updatedAt, __v, _id, status, ...rest } =
        engagementTask.toObject();
      return { id: _id, ...rest };
    });
    return res.status(200).json(engagementtask);
  } catch (error) {
    console.log(error);
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
      .sort({ createdAt: -1 })
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
        status,
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
    console.log(error);
    next(error);
  }
};

export const postEngagementTask = async (req, res, next) => {
  const {
    earnId,
    payId,
    title,
    taskType,
    gender,
    location,
    religion,
    link,
    numberOfTasks,
    taskPlatform,
    customComment,
  } = req.body;

  try {
    // Checks for valid user
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const earnEngagement = await EarnEngagement.findById(earnId);
    const { amountToEarn } = earnEngagement.toObject();
    const createEngagement = await CreateEngagement.findById(payId);
    const { amountToPay } = createEngagement.toObject();
    const paymentResponse = await processPayment(
      Number(numberOfTasks) * Number(amountToPay),
      taskType,
      req.user._id
    );
    if (!paymentResponse.status) {
      return res.status(400).json(paymentResponse);
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
      costPerTask: Number(amountToPay),
      earningPerTask: Number(amountToEarn),
      status: "pending",
      title,
      customComment,
    });

    await newEngagementTask.save();

    const notification = {
      title: "New Task Created!",
      body: "A new engagement task has just been posted rush in now to claim your earning!.",
      icon: "./gigsflix_logo_white.png",
      data: {
        url: `${
          process.env.NODE_ENV === "development"
            ? process.env.DEV_CLIENT_URL
            : process.env.PROD_CLIENT_URL
        }/earn`,
      },
    };

    await sendPushNotification(notification);
    return res.status(200).json({
      ...paymentResponse,
      message: "Engagement Task Created successfully.",
      failed: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Gets task(s) totals
export const getTotalTasks = async (req, res, next) => {
  const { type: taskType, platform: taskPlatform } = req.query;

  try {
    const baseQuery = {};
    if (taskPlatform) baseQuery.taskPlatform = taskPlatform;
    const Tasks =
      taskType == "advert"
        ? await AdvertTask.find(baseQuery)
        : await EngagementTask.find(baseQuery);

    const tAsks = Tasks.map((Task) => {
      const {
        createdBy,
        updatedAt,
        gender,
        location,
        religion,
        caption,
        allocatedTasks,
        numberOfTasks,
        __v,
        _id,
        ...rest
      } = Task.toObject();

      if (allocatedTasks < numberOfTasks) {
        return { id: _id, ...rest };
      }
      return null;
    });
    const tasks = tAsks.filter((task) => task !== null);

    const taskIds = tasks.map((task) => task.id);
    const userId = req.user._id;

    const userTasks = await Promise.all([
      await AllocatedTask.find({
        allocatedTo: userId,
        taskType,
        taskPlatform,
        parentId: { $in: taskIds },
      }),
      await PendingTask.find({
        toBeDoneBy: userId,
        taskType,
        taskPlatform,
        parentId: { $in: taskIds },
      }),
      await CompletedTask.find({
        doneBy: userId,
        taskType,
        taskPlatform,
        parentId: { $in: taskIds },
      }),
      await InReviewTask.find({
        doneBy: userId,
        taskType,
        taskPlatform,
        parentId: { $in: taskIds },
      }),
    ]);

    const userTaskIds = new Set(
      userTasks.flat().map((task) => task.parentId.toString())
    );

    const total = tasks.reduce((count, task) => {
      if (!userTaskIds.has(task.id.toString())) {
        count += 1;
      }
      return count;
    }, 0);

    const response = { total: total };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUserTotalTasks = async (req, res, next) => {
  const { type: taskType, platform: taskPlatform } = req.query;

  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });

    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const baseQuery = {};
    if (taskPlatform) baseQuery.taskPlatform = taskPlatform;
    if (taskType) baseQuery.taskType = taskType;

    const allocatedTasks = await AllocatedTask.find({
      allocatedTo: req.user._id,
      ...baseQuery,
    });
    const cancelledTasks = await CancelledTask.find({
      cancelledBy: req.user._id,
      ...baseQuery,
    });
    const pendingTask = await PendingTask.findOne({
      toBeDoneBy: req.user._id,
      ...baseQuery,
    });
    const failedTasks = await FailedTask.find({
      doneBy: req.user._id,
      ...baseQuery,
    });
    const completedTasks = await CompletedTask.find({
      doneBy: req.user._id,
      ...baseQuery,
    });
    const inReviewTasks = await InReviewTask.find({
      doneBy: req.user._id,
      ...baseQuery,
    });

    const response = {
      allocated: allocatedTasks.length,
      cancelled: cancelledTasks.length,
      pending: pendingTask ? 1 : 0,
      failed: failedTasks.length,
      completed: completedTasks.length,
    };
    response["in-review"] = inReviewTasks.length;

    // Creates the response
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const generateTask = async (req, res, next) => {
  const taskType = req.query.type || null;
  const taskPlatform = req.query.platform || null;
  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });
    const taskAllocatedToUser =
      (await AllocatedTask.findOne({
        allocatedTo: req.user._id,
        taskType,
        taskPlatform,
      })) ||
      (await PendingTask.findOne({
        toBeDoneBy: req.user._id,
        taskType,
        taskPlatform,
      }));

    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    if (!taskPlatform || !taskType) {
      const error = ErrorHandler(400, "Parameters Invalid.");
      return res.status(400).json(error);
    }
    if (taskAllocatedToUser) {
      const error = ErrorHandler(
        400,
        "You have a pending task of this type, complete the task to generate a new one."
      );
      return res.status(400).json(error);
    }

    const baseQuery = { taskPlatform, taskType };
    const Tasks =
      taskType == "advert"
        ? await AdvertTask.find(baseQuery)
        : await EngagementTask.find(baseQuery);

    const taskS = await Promise.all(
      Tasks.map(async (Task) => {
        if (!Task) return null; // Check for undefined Task

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

        // Check if user has done task before
        const userHasDoneTaskBefore =
          (await AllocatedTask.findOne({
            allocatedTo: req.user._id,
            taskType,
            taskPlatform,
            parentId: _id,
          })) ||
          (await PendingTask.findOne({
            toBeDoneBy: req.user._id,
            taskType,
            taskPlatform,
            parentId: _id,
          })) ||
          (await CompletedTask.findOne({
            doneBy: req.user._id,
            taskType,
            taskPlatform,
            parentId: _id,
          })) ||
          (await InReviewTask.findOne({
            doneBy: req.user._id,
            taskType,
            taskPlatform,
            parentId: _id,
          }));

        if (allocatedTasks < numberOfTasks && !userHasDoneTaskBefore) {
          return {
            id: _id,
            allocatedTasks,
            numberOfTasks,
            ...rest,
          };
        }
        return null; // Return null for tasks that don't meet the criteria
      })
    );
    // Filter out null values from the resulting array
    const tasks = taskS.filter((task) => task !== null);

    if (!tasks.length) {
      const error = ErrorHandler(
        400,
        "Task of this type is not available for you again. Please check back later."
      );
      return res.status(400).json(error);
    }

    const arrayLength = tasks.length;
    const randomIndex = Math.floor(Math.random() * arrayLength);
    if (!arrayLength) {
      return res.status(404).json({
        message: "No task available for this task type.",
        failed: true,
      });
    }
    const Task = tasks[randomIndex];

    // Needs to check something here
    const newAllocatedTask = new AllocatedTask({
      createdBy: Task?.createdBy,
      parentId: Task?.id,
      allocatedTo: req.user?._id,
      taskType: taskType,
      taskPlatform: Task?.taskPlatform,
      link: Task?.link,
      earningPerTask: Task?.earningPerTask,
      title: Task?.title,
      caption: Task?.caption,
      mediaUrl: Task?.mediaUrl,
    });
    const newPendingTask = new PendingTask({
      allocationId: newAllocatedTask?._id,
      createdBy: Task?.createdBy,
      parentId: Task?.id,
      toBeDoneBy: req.user?._id,
      taskType: taskType,
      taskPlatform: Task?.taskPlatform,
      link: Task?.link,
      earningPerTask: Task?.earningPerTask,
      title: Task?.title,
      caption: Task?.caption,
      mediaUrl: Task?.mediaUrl,
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

    const task = {
      id: _id,
      timeLeftS: 3600,
      ...rest,
    };

    // Creates the response
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Cancels generated task
export const cancelGeneratedTask = async (req, res, next) => {
  const { type: taskType, platform: taskPlatform } = req.query;

  try {
    const taskAllocatedToUser = await AllocatedTask.findOne({
      allocatedTo: req.user._id,
      taskType,
      taskPlatform,
    });
    if (!taskPlatform || !taskType) {
      const error = ErrorHandler(400, "Invalid Parameters.");
      return res.status(400).json(error);
    }
    if (!taskAllocatedToUser) {
      const error = ErrorHandler(400, "Cannot perform this action.");
      return res.status(400).json(error);
    }

    const userPendingTask = await PendingTask.findOne({
      allocationId: taskAllocatedToUser._id,
    });
    const {
      createdBy,
      parentId,
      link,
      earningPerTask,
      title,
      caption,
      mediaUrl,
    } = userPendingTask.toObject();
    const newCancelledTask = new CancelledTask({
      title,
      createdBy,
      parentId,
      cancelledBy: req.user._id,
      taskType,
      taskPlatform,
      link,
      earningPerTask,
      caption,
      mediaUrl,
    });

    // Does the necessary addition and removal.
    await PendingTask.findOneAndDelete({
      allocationId: taskAllocatedToUser._id,
    });
    await AllocatedTask.findOneAndDelete({ _id: taskAllocatedToUser._id });
    await newCancelledTask.save();

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
    console.log(error);
    next(error);
  }
};

// Get user's tasks history based on the status
export const getUserTasksHistory = async (req, res, next) => {
  const { status: taskStatus } = req.query;

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

    let query = {};
    const userId = req.user._id;

    switch (taskStatus) {
      case "allocated":
        query = { allocatedTo: userId };
        break;
      case "cancelled":
        query = { cancelledBy: userId };
        break;
      case "pending":
        query = { toBeDoneBy: userId };
        break;
      case "failed":
        query = { doneBy: userId };
        break;
      case "completed":
        query = { doneBy: userId };
        break;
      case "in-review":
        query = { doneBy: userId };
        break;
      default:
        return res.status(400).json({ error: "Invalid task status." });
    }

    let Tasks = [];

    switch (taskStatus) {
      case "allocated":
        Tasks = await AllocatedTask.find(query);
        break;
      case "cancelled":
        Tasks = await CancelledTask.find(query);
        break;
      case "pending":
        Tasks = await PendingTask.find(query);
        break;
      case "failed":
        Tasks = await FailedTask.find(query);
        break;
      case "completed":
        Tasks = await CompletedTask.find(query);
        break;
      case "in-review":
        Tasks = await InReviewTask.find(query);
        break;
    }

    if (!Tasks.length) {
      const error = ErrorHandler(404, "No data available.");
      return res.status(404).json(error);
    }

    const tasks = Tasks.map((Task) => {
      const {
        updatedAt,
        createdBy,
        parentId,
        expiresAt,
        toBeDoneBy,
        __v,
        _id,
        ...rest
      } = Task.toObject();

      return {
        id: _id,
        ...rest,
      };
    });

    // Creates the response
    return res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get user's tasks list based on the status
export const getTasks = async (req, res, next) => {
  const {
    status: taskStatus,
    platform: taskPlatform,
    type: taskType,
  } = req.query;

  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    if (!taskStatus || !taskPlatform || !taskType) {
      const error = ErrorHandler(400, "Invalid Parameters.");
      return res.status(400).json(error);
    }

    const userId = req.user._id;
    let query = { taskPlatform };

    switch (taskStatus) {
      case "allocated":
        query.allocatedTo = userId;
        break;
      case "cancelled":
        query.cancelledBy = userId;
        break;
      case "pending":
        query.toBeDoneBy = userId;
        break;
      case "failed":
      case "completed":
      case "in-review":
        query.doneBy = userId;
        break;
      default:
        return res.status(400).json({ error: "Invalid task status." });
    }

    if (taskStatus === "pending") {
      const Task = await PendingTask.findOne(query);
      if (!Task) {
        return res.status(200).json(null);
      }

      const {
        updatedAt,
        createdBy,
        parentId,
        expiresAt,
        toBeDoneBy,
        __v,
        _id,
        ...rest
      } = Task.toObject();

      const currentTime = new Date();
      const expiryTime = Task.expiresAt;

      // Gets time left in seconds for this pending task to expire
      const timeLeftS = (expiryTime - currentTime) / 1000;

      const task = { id: _id, timeLeftS, ...rest };

      // Creates the response
      return res.status(200).json(task);
    } else {
      let Tasks = [];

      switch (taskStatus) {
        case "allocated":
          Tasks = await AllocatedTask.find(query);
          break;
        case "cancelled":
          Tasks = await CancelledTask.find(query);
          break;
        case "failed":
          Tasks = await FailedTask.find(query);
          break;
        case "completed":
          Tasks = await CompletedTask.find(query);
          break;
        case "in-review":
          Tasks = await InReviewTask.find(query);
          break;
      }

      if (!Tasks.length) {
        const error = ErrorHandler(404, "No data available.");
        return res.status(404).json(error);
      }

      const tasks = Tasks.map((Task) => {
        const {
          updatedAt,
          createdBy,
          parentId,
          expiresAt,
          toBeDoneBy,
          __v,
          _id,
          ...rest
        } = Task.toObject();
        return { id: _id, ...rest };
      });

      // Creates the response
      return res.status(200).json(tasks);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  const { id } = req.params;
  const {
    status: taskStatus,
    platform: taskPlatform,
    type: taskType,
  } = req.query;

  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    if (!taskStatus || !taskPlatform || !taskType) {
      const error = ErrorHandler(400, "Invalid Parameters.");
      return res.status(400).json(error);
    }

    const userId = req.user._id;
    const query = { taskPlatform, taskType, _id: id };
    let task;

    switch (taskStatus) {
      case "allocated":
        query.allocatedTo = userId;
        task = await AllocatedTask.findOne(query);
        break;
      case "cancelled":
        query.cancelledBy = userId;
        task = await CancelledTask.findOne(query);
        break;
      case "pending":
        query.toBeDoneBy = userId;
        task = await PendingTask.findOne(query);
        break;
      case "failed":
        query.doneBy = userId;
        task = await FailedTask.findOne(query);
        break;
      case "completed":
        query.doneBy = userId;
        task = await CompletedTask.findOne(query);
        break;
      case "in-review":
        query.doneBy = userId;
        task = await InReviewTask.findOne(query);
        break;
      default:
        return res.status(400).json({ error: "Invalid task status." });
    }

    if (!task) {
      const error = ErrorHandler(404, "No data available.");
      return res.status(404).json(error);
    }

    const { updatedAt, expiresAt, toBeDoneBy, __v, _id, ...rest } = task._doc;

    if (taskStatus === "pending") {
      const currentTime = new Date();
      const timeLeftS = (expiresAt - currentTime) / 1000;
      const responseObj = { id: _id, timeLeftS, ...rest };
      return res.status(200).json(responseObj);
    }

    if (
      taskStatus === "in-review" ||
      taskStatus === "completed" ||
      taskStatus === "failed"
    ) {
      const proofOfWork = await ProofOfWork.findOne({ parentId: _id });
      if (!proofOfWork) {
        const error = ErrorHandler(400, "No proof of work for this task.");
        return res.status(400).json(error);
      }

      const {
        __v: proofV,
        updatedAt: proofUpdatedAt,
        parentId: proofParentId,
        createdBy: proofCreatedBy,
        _id: proofId,
        ...proofDetails
      } = proofOfWork._doc;
      const responseObj = { id: _id, proof: proofDetails, ...rest };

      return res.status(200).json(responseObj);
    }

    const responseObj = { id: _id, ...rest };
    return res.status(200).json(responseObj);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const requestForReview = async (req, res, next) => {
  const {
    username,
    image,
    id,
    type,
    platform,
    parentId,
    createdBy,
    title,
    link,
    caption,
    mediaUrl,
  } = req.body;

  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });
    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }
    const validUserDetails = await userDetails.findOne({
      userId: validUser._id,
    });
    if (!validUserDetails) {
      const error = ErrorHandler(404, "There's no details for this user.");
      return res.status(404).json(error);
    }

    // const earningPerTask =
    const pendingTaskDetails = await PendingTask.findOne({
      toBeDoneBy: req.user._id,
      taskPlatform: platform,
      taskType: type,
      allocationId: id,
    });

    if (!pendingTaskDetails) {
      const error = ErrorHandler(
        404,
        "There's no pending task of this type for this platform."
      );
      return res.status(404).json(error);
    }
    const { earningPerTask } = pendingTaskDetails?.toObject();

    // Creates new task for review
    const newInReviewTask = new InReviewTask({
      parentId,
      createdBy,
      doneBy: req.user._id,
      title,
      taskType: type,
      taskPlatform: platform,
      link,
      earningPerTask,
      caption,
      mediaUrl,
    });
    // Creates new proof of work
    const newProofOfWork = new ProofOfWork({
      createdBy: req.user._id,
      username,
      imageUrl: image,
      grandParentId: parentId,
      parentId: newInReviewTask._id,
      taskPlatform: platform,
      taskType: type,
      requestFrom: createdBy,
    });
    await newProofOfWork.save();
    await newInReviewTask.save();

    // Deletes the allocation and pending task.
    await PendingTask.findOneAndDelete({ allocationId: id });
    await AllocatedTask.findOneAndDelete({ _id: id });

    // Update user earnings
    validUserDetails.userEarnings = {
      ...validUserDetails.userEarnings,
      pendingEarnings:
        Number(validUserDetails.userEarnings.pendingEarnings) +
        Number(earningPerTask),
    };
    await validUserDetails.save();

    return res.status(200).send({
      failed: false,
      message: "Task uploaded for review.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProofsOfWork = async (req, res, next) => {
  const { type, platform, id } = req.query;

  try {
    // Validations for user request
    const validUser = await User.findOne({ email: req.user.email });

    if (!validUser) {
      const error = ErrorHandler(404, "There's no user with this email.");
      return res.status(404).json(error);
    }

    const proofs = await ProofOfWork.find({
      requestFrom: req.user._id,
      taskPlatform: platform,
      taskType: type,
      grandParentId: id,
    }).sort({ createdAt: -1 });

    if (!proofs) {
      const error = ErrorHandler(404, "No proof of work for this task.");
      return res.status(404).json(error);
    }

    const proofObject = await Promise.all(
      proofs.map(async (proof) => {
        const {
          updatedAt,
          createdBy,
          taskType,
          taskPlatform,
          grandParentId,
          requestFrom,
          __v,
          _id,
          ...rest
        } = proof?.toObject();

        const proofPoster = await User.findOne({ _id: createdBy });

        return {
          id: _id,
          posterUsername: proofPoster?.username,
          posterImage: proofPoster?.image,
          ...rest,
        };
      })
    );

    return res.status(200).json(proofObject);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const sanctionTask = async (req, res, next) => {
  const { id, sanction, parentId, reason } = req.query;

  try {
    const taskInReview = await InReviewTask.findOneAndDelete({ _id: parentId });
    if (!taskInReview) {
      const error = ErrorHandler(400, "No task in review.");
      return res.status(400).json(error);
    }

    const taskDoerDetails = await userDetails.findOne({
      userId: taskInReview?.doneBy,
    });

    if (!taskDoerDetails) {
      const error = ErrorHandler(404, "There's no doer details for this user.");
      return res.status(404).json(error);
    }

    let notification;
    if (sanction == 1) {
      // Creates a completed task if task is approved
      const newTaskCompleted = new CompletedTask({
        parentId: taskInReview?.parentId,
        proofParentId: taskInReview?._id,
        doneBy: taskInReview?.doneBy,
        title: taskInReview?.title,
        createdBy: req.user._id,
        taskType: taskInReview?.taskType,
        taskPlatform: taskInReview?.taskPlatform,
        link: taskInReview?.link,
        earningPerTask: taskInReview?.earningPerTask,
        caption: taskInReview.caption,
        mediaUrl: taskInReview.mediaUrl,
      });
      await newTaskCompleted.save();

      // Creates notitfication
      notification = {
        userId: taskInReview?.doneBy,
        title: "Task Reviewed!",
        message:
          "Hurray!!, your task has been reviewed and has been APPROVED, check your balance and task history for confirmation. Generate a new task to earn more.",
        type: "task",
      };

      taskDoerDetails.userEarnings = {
        ...taskDoerDetails.userEarnings,
        balance:
          Number(taskDoerDetails.userEarnings.balance) +
          Number(taskInReview?.earningPerTask),
        totalEarnings:
          Number(taskDoerDetails.userEarnings.totalEarnings) +
          Number(taskInReview?.earningPerTask),
        pendingEarnings:
          Number(taskDoerDetails.userEarnings.pendingEarnings) -
          Number(taskInReview?.earningPerTask),
      };
      taskDoerDetails.walletDetails = {
        ...taskDoerDetails.walletDetails,
        balance:
          Number(taskDoerDetails.walletDetails.balance) +
          Number(taskInReview?.earningPerTask),
      };
      await taskDoerDetails.save();

      const taskQuery = {
        taskPlatform: taskInReview?.taskPlatform,
        taskType: taskInReview?.taskType,
        _id: taskInReview?.parentId,
      };
      taskInReview?.taskType == "advert"
        ? await AdvertTask.findOneAndUpdate(taskQuery, {
            $inc: {
              completedTasks: 1,
            },
          })
        : await EngagementTask.findOneAndUpdate(taskQuery, {
            $inc: {
              completedTasks: 1,
            },
          });
    } else {
      // Creates a failed task if task is disapproved
      const newTaskFailed = new FailedTask({
        parentId: taskInReview?.parentId,
        doneBy: taskInReview?.doneBy,
        title: taskInReview?.title,
        createdBy: req.user._id,
        taskType: taskInReview?.taskType,
        taskPlatform: taskInReview?.taskPlatform,
        link: taskInReview?.link,
        earningPerTask: taskInReview?.earningPerTask,
        caption: taskInReview.caption,
        mediaUrl: taskInReview.mediaUrl,
        reason,
      });
      await newTaskFailed.save();

      // Creates notitfication
      notification = {
        userId: taskInReview?.doneBy,
        title: "Task Reviewed",
        message: `Your task has been reviewed and has been DISapproved because - ${reason}, generate a new task and ask for review.`,
        type: "task",
      };

      // Update user earnings
      taskDoerDetails.userEarnings = {
        ...taskDoerDetails.userEarnings,
        pendingEarnings:
          Number(taskDoerDetails.userEarnings.pendingEarnings) -
          Number(taskInReview?.earningPerTask),
      };
      await taskDoerDetails.save();

      const taskQuery = {
        taskPlatform: taskInReview?.taskPlatform,
        taskType: taskInReview?.taskType,
        _id: taskInReview?.parentId,
      };
      taskInReview?.taskType == "advert"
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
    }

    // Update proof to based on sanction
    const proof = await ProofOfWork.findOneAndUpdate(
      {
        _id: id,
      },
      {
        status: sanction == 1 ? "approved" : "disapproved",
      }
    );

    if (!proof) {
      const error = ErrorHandler(404, "No proof of work for this task.");
      return res.status(404).json(error);
    }

    // Send notification to user
    await sendNotitfication(notification);

    return res.status(200).json({
      failed: false,
      message: sanction,
    });
  } catch (error) {
    next(error);
  }
};

export const sanction = async (id, sanction, parentId, userId) => {
  try {
    const taskInReview = await InReviewTask.findOneAndDelete({ _id: parentId });
    if (!taskInReview) {
      return false;
    }

    const taskDoerDetails = await userDetails.findOne({
      userId: taskInReview?.doneBy,
    });

    if (!taskDoerDetails) {
      return false;
    }

    let notification;
    if (sanction == 1) {
      // Creates a completed task if task is approved
      const newTaskCompleted = new CompletedTask({
        parentId: taskInReview?.parentId,
        proofParentId: taskInReview?._id,
        doneBy: taskInReview?.doneBy,
        title: taskInReview?.title,
        createdBy: userId,
        taskType: taskInReview?.taskType,
        taskPlatform: taskInReview?.taskPlatform,
        link: taskInReview?.link,
        earningPerTask: taskInReview?.earningPerTask,
        caption: taskInReview.caption,
        mediaUrl: taskInReview.mediaUrl,
      });
      await newTaskCompleted.save();

      // Creates notitfication
      notification = {
        userId: taskInReview?.doneBy,
        title: "Task Reviewed!",
        message:
          "Hurray!!, your task has been reviewed and has been APPROVED, check your balance and task history for confirmation. Generate a new task to earn more.",
        type: "task",
      };

      taskDoerDetails.userEarnings = {
        ...taskDoerDetails.userEarnings,
        balance:
          Number(taskDoerDetails.userEarnings.balance) +
          Number(taskInReview?.earningPerTask),
        totalEarnings:
          Number(taskDoerDetails.userEarnings.totalEarnings) +
          Number(taskInReview?.earningPerTask),
        pendingEarnings:
          Number(taskDoerDetails.userEarnings.pendingEarnings) -
          Number(taskInReview?.earningPerTask),
      };
      taskDoerDetails.walletDetails = {
        ...taskDoerDetails.walletDetails,
        balance:
          Number(taskDoerDetails.walletDetails.balance) +
          Number(taskInReview?.earningPerTask),
      };
      await taskDoerDetails.save();

      const taskQuery = {
        taskPlatform: taskInReview?.taskPlatform,
        taskType: taskInReview?.taskType,
        _id: taskInReview?.parentId,
      };
      taskInReview?.taskType == "advert"
        ? await AdvertTask.findOneAndUpdate(taskQuery, {
            $inc: {
              completedTasks: 1,
            },
          })
        : await EngagementTask.findOneAndUpdate(taskQuery, {
            $inc: {
              completedTasks: 1,
            },
          });
    } else {
      // Creates a failed task if task is disapproved
      const newTaskFailed = new FailedTask({
        parentId: taskInReview?.parentId,
        doneBy: taskInReview?.doneBy,
        title: taskInReview?.title,
        createdBy: userId,
        taskType: taskInReview?.taskType,
        taskPlatform: taskInReview?.taskPlatform,
        link: taskInReview?.link,
        earningPerTask: taskInReview?.earningPerTask,
        caption: taskInReview.caption,
        mediaUrl: taskInReview.mediaUrl,
      });
      await newTaskFailed.save();
      // Creates notitfication
      notification = {
        userId: taskInReview?.doneBy,
        title: "Task Reviewed",
        message:
          "Your task has been reviewed and has been DISapproved due to its invalidity, generate a new task and ask for review.",
        type: "task",
      };

      // Update user earnings
      taskDoerDetails.userEarnings = {
        ...taskDoerDetails.userEarnings,
        pendingEarnings:
          Number(taskDoerDetails.userEarnings.pendingEarnings) -
          Number(taskInReview?.earningPerTask),
      };
      await taskDoerDetails.save();

      const taskQuery = {
        taskPlatform: taskInReview?.taskPlatform,
        taskType: taskInReview?.taskType,
        _id: taskInReview?.parentId,
      };
      taskInReview?.taskType == "advert"
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
    }

    // Update proof to based on sanction
    const proof = await ProofOfWork.findOneAndUpdate(
      {
        _id: id,
      },
      {
        status: sanction == 1 ? "approved" : "disapproved",
      }
    );

    if (!proof) {
      return false;
    }

    // Send notification to user
    await sendNotitfication(notification);
    return true;
  } catch (error) {
    logger.error(error.message);
    return false;
  }
};

export const sanctionAllTask = async (req, res, next) => {
  const { type } = req.query;

  try {
    const tasksInReview = await InReviewTask.find();

    for (const taskInReview of tasksInReview) {
      const proofOfWork = await ProofOfWork.findOne({
        parentId: taskInReview._id,
      });
      if (!proofOfWork) {
        return res.status(500).json({
          failed: true,
          message: "Proof of work not found for a task",
        });
      }

      const taskSanctioned = await sanction(
        proofOfWork._id,
        type,
        taskInReview._id,
        req.user._id
      );

      if (!taskSanctioned) {
        return res.status(500).json({
          failed: true,
          message: "Task sanctioning failed",
        });
      }
    }

    return res.status(200).json({
      failed: false,
      message: "All tasks in review have been approved",
    });
  } catch (error) {
    next(error);
  }
};

export const processPayment = async (amount, type, userId) => {
  try {
    // Validates user details
    const validUserDetails = await userDetails.findOne({
      userId,
    });
    if (!validUserDetails) {
      return {
        status: false,
        failed: true,
        message: "Valid user details not found.",
      };
    }

    // Checks if user has enough balance
    if (validUserDetails.userEarnings.balance < amount) {
      return {
        status: false,
        failed: true,
        message: "Insufficient funds. Fund your wallet",
      };
    }

    validUserDetails.userEarnings = {
      ...validUserDetails.userEarnings,
      balance: Number(validUserDetails.userEarnings.balance) - Number(amount),
      amountSpent:
        Number(validUserDetails.userEarnings.amountSpent) + Number(amount),
    };
    validUserDetails.walletDetails = {
      ...validUserDetails.walletDetails,
      balance: Number(validUserDetails.walletDetails.balance) - Number(amount),
    };
    await validUserDetails.save();

    // Creates notitfication
    const notification = {
      userId,
      title: "Purchase Completed!",
      message: `Your ${type} order worth ₦${numeral(amount).format(
        "0,0.00"
      )} has been received, your order will be delivered as soon as possible. Thanks for choosing gigsflix.`,
      type,
    };

    // Send notification to user
    await sendNotitfication(notification);

    return {
      status: true,
      failed: false,
      message: "Payment process successful",
    };
  } catch (error) {
    return {
      status: false,
      failed: true,
      message: "An error occurred while processing payment.",
    };
  }
};
