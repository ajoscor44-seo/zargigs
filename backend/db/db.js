import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      minPoolSize: 10,
    });
    isConnected = true;

    console.log("Connected to database");
  } catch (error) {
    console.log("Mongo Db connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;
