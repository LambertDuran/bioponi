import { Application } from "express";
const express = require("express");
const app: Application = express();
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const logger = require("./middlewares/logger");
const authMiddleware = require("./middlewares/auth");
const food = require("./routes/food");
const fish = require("./routes/fish");
const pool = require("./routes/pool");
const action = require("./routes/action");
const user = require("./routes/user");
const auth = require("./routes/auth");

if (!process.env.JWT_PRIVATE_KEY) {
  console.error("FATAL ERROR: JWT_PRIVATE_KEY is not defined.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(helmet());
app.use(compression());
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use(authMiddleware);
app.use("/api/food", food);
app.use("/api/fish", fish);
app.use("/api/pool", pool);
app.use("/api/action", action);

module.exports = app;
