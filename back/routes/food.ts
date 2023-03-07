import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("req received!");

  const food = await prisma.food.findMany();

  res.json(food);
});

module.exports = router;
