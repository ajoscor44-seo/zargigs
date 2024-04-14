import AdvertTask from "../Models/advertTask.model.js";
import EngagementTask from "../Models/engagementTask.js";
import PendingTask from "../Models/pending-tasks.model.js";
import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";

// Advert task controllers
export const getAdvertTask = async (req, res, next) => {
  const { id } = req.params;
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
};

export const getAdvertTasks = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const taskPlatform = req.query.platform || null;

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
};

export const postAdvertTask = async (req, res, next) => {
  const {
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
    allocatedTasks: [],
    completedTasks: [],
    costPerTask: Number(costPerTask),
    status: "pending",
  });
  await newAdvertTask.save(); // Saves new advert task

  res.status(200).json({
    status: 200,
    failed: false,
    message: "Advert Created successfully.",
  });
  next();
};

// Engagement task controllers
export const getEngagementTask = async (req, res, next) => {
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
};

export const getEngagementTasks = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const taskPlatform = req.query.platform || null;

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
};

export const postEngagementTask = async (req, res, next) => {
  const {
    taskType,
    gender,
    location,
    religion,
    link,
    numberOfTasks,
    costPerTask,
    taskPlatform,
  } = req.body;

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
    allocatedTasks: [],
    completedTasks: [],
    costPerTask: Number(costPerTask),
    status: "pending",
  });
  await newEngagementTask.save(); // Saves new engagement task
  res.status(200).json({
    status: 200,
    failed: false,
    message: "Engagement Task Created successfully.",
  });
  next();
};

// Pending engagement task controllers
export const getPendingEngagementTask = async (req, res, next) => {
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
};

export const getPendingEngagementTasks = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const taskPlatform = req.query.platform || null;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  const baseQuery = { doneBy: req.user._id };
  if (taskPlatform) baseQuery.taskPlatform = taskPlatform;

  const pendingEngagementTasks = await PendingTask.find(baseQuery)
    .skip((page - 1) * limit)
    .limit(limit);

  const pendingEngagementtasks = pendingEngagementTasks.map(
    (engagementTask) => {
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
    }
  );

  const totalCount = await PendingTask.countDocuments(baseQuery);
  const totalPages = Math.ceil(totalCount / limit);

  const response =
    Number(req.query.limit) > 0
      ? {
          data: pendingEngagementtasks,
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
};

export const postPendingEngagementTask = async (req, res, next) => {
  const { taskCreator, taskType, link, earningPerTask, taskPlatform } =
    req.body;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }

  // Create new pending task
  const newPendingTask = new PendingTask({
    createdBy: taskCreator,
    doneBy: req.user._id,
    taskType,
    taskPlatform,
    link,
    earningPerTask: Number(earningPerTask),
  });
  await newPendingTask.save(); // Saves new engagement task
  res.status(200).json({
    status: 200,
    failed: false,
    message: "Pending Task Created successfully.",
  });
  next();
};

// Gets task(s) totals
export const getTotalTasks = async (req, res, next) => {
  const taskType = req.query.type || null;
  const taskPlatform = req.query.platform || null;

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
};

// Generates tasks
export const generateTask = async (req, res, next) => {
  const taskType = req.query.type || null;
  const taskPlatform = req.query.platform || null;

  // Checks for valid user
  const validUser = await User.findOne({ email: req.user.email });
  if (!validUser) {
    const error = ErrorHandler(404, "There's no user with this email.");
    return res.status(404).json(error);
  }
  if (!taskPlatform || !taskType) {
    const error = ErrorHandler(400, "Parameters Invalid.");
    return res.status(400).json(error);
  }

  const baseQuery = { taskPlatform, taskType };
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

  const response = { tasks: tasks };
  res.status(200).json(response);
  next();
};
