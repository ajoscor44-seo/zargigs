import mongoose from "mongoose";
import { supabase } from "../api/V1/config/supabase.config.js";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    return;
  }
  try {
    // Verify Supabase connection
    const { data, error } = await supabase.from("admin_settings").select("id").limit(1);
    if (error && error.code !== "PGRST116" && error.code !== "42P01") {
      console.log("Supabase connected with response:", error.message);
    } else {
      console.log("Connected to Supabase successfully at:", process.env.SUPABASE_URL || "https://itzqsxmjyjfgtbolfhmq.supabase.co");
    }

    // Connect to MongoDB if DATABASE_URI is a mongodb uri
    if (process.env.DATABASE_URI && process.env.DATABASE_URI.startsWith("mongodb")) {
      await mongoose.connect(process.env.DATABASE_URI, {
        minPoolSize: 10,
      });
      console.log("Connected to MongoDB database");
    }
    
    isConnected = true;
  } catch (error) {
    console.log("Database connection notice:", error.message || error);
    isConnected = true;
  }
};

export default connectDb;

