import validateFood from "../controllers/food";
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const food = await prisma.food.findMany();
  if (!food) return res.status(404).send("Aucun aliment trouvé!");
  res.json(food);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateFood(req.body);
  if (error) {
    console.log("error", error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  console.log("1");

  const existingFood = await prisma.food.findFirst({
    where: {
      name: req.body.name,
    },
  });
  console.log("2");
  if (existingFood) return res.status(400).send("Food already exists!");
  console.log("3");

  const food = await prisma.food.create({
    data: {
      name: req.body.name,
      froms: req.body.froms,
      tos: req.body.tos,
      ranges: req.body.ranges,
      sizes: req.body.sizes,
      foodRates: req.body.foodRates,
      prices: req.body.prices,
      distributions: req.body.distributions,
    },
  });
  console.log("4");

  if (!food) return res.status(400).send("Prisma error creation!");
  console.log("5");
  res.json(food);
});

module.exports = router;
