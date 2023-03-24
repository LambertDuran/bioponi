import { Application } from "express";
const express = require("express");
const app: Application = express();
const cors = require("./middlewares/cor");
const logger = require("./middlewares/logger");
const food = require("./routes/food");
const fish = require("./routes/fish");
const pool = require("./routes/pool");
const action = require("./routes/action");

app.use(cors);
app.use(express.json());
app.use(logger);
app.use("/api/food", food);
app.use("/api/fish", fish);
app.use("/api/pool", pool);
app.use("/api/action", action);

module.exports = app;
