import { Request, Response, NextFunction } from "express";
const express = require("express");
const app = express();
const cors = require("./middlewares/cor");
const logger = require("./middlewares/logger");
const food = require("./routes/food");

app.use(cors);
app.use(express.json());
app.use(logger);
app.use("/api/food", food);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = server;
