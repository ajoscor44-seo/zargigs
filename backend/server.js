import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import useRoutes from "./V1/Routes/user.route.js";
import authRoutes from "./V1/Routes/auth.route.js";
dotenv.config();
// import bodyParser from "body-parser";
// import cors from "cors";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.use("/api/v1/user", useRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running");
});
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());
