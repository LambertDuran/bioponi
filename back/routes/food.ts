const { validateFood } = require("../controllers/food");
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/", async (req: any, res: Response, next: NextFunction) => {
  const food = await prisma.food.findMany({
    where: {
      userId: req.user.id,
    },
  });
  if (food.length < 1) return res.status(404).send("Aucun aliment trouvé!");
  res.json(food);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const food = await prisma.food.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!food) return res.status(404).send("Food not found!");
  res.json(food);
});

router.post("/", async (req: any, res: Response, next: NextFunction) => {
  const { error } = validateFood(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingFood = await prisma.food.findFirst({
    where: {
      name: req.body.name,
      userId: req.user.id,
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
      distributions: req.body.distributions,
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });

  if (!food) return res.status(400).send("Prisma error creation!");
  res.json(food);
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateFood(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingFood = await prisma.food.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!existingFood) return res.status(404).send("Food doesn't exist!");

  const food = await prisma.food.update({
    where: {
      id: parseInt(req.params.id),
    },
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

  if (!food) return res.status(404).send("Food not found!");
  res.json(food);
});

module.exports = router;
