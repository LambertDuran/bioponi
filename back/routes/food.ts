import validateFood from "../controllers/food";
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("GET received!");
  const food = await prisma.food.findMany();
  res.json(food);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("POST received!");

  const { error } = validateFood(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingFood = await prisma.food.findFirst({
    where: {
      name: req.body.name,
    },
  });
  if (existingFood) return res.status(400).send("Food already exists!");

  const food = await prisma.food.create({
    data: {
      name: req.body.name,
      froms: req.body.froms,
      tos: req.body.tos,
      ranges: req.body.ranges,
      sizes: req.body.sizes,
      foodRates: req.body.foodRates,
      prices: req.body.prices,
      distribution: req.body.distribution,
    },
  });

  if (!food) return res.status(400).send("Bad request!");
  res.json(food);
});

module.exports = router;
