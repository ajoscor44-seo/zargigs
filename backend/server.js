import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

app.listen(3000, () => {
  console.log("Server running");
});

// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());
