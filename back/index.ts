import { Request, Response, NextFunction } from "express";
const express = require("express");
const app = express();
const food = require("./routes/food");
const cors = require("./middlewares/cor");

app.use(cors);
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/food", food);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = server;
