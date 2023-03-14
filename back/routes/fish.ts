import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  const fish = await prisma.fish.findMany();
  if (!fish) return res.status(404).send("Aucun poisson trouvé!");
  res.json(fish);
});

router.post("/", async (req: Request, res: Response) => {
  // const { error } = validateFish(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const existingFish = await prisma.fish.findFirst({
    where: {
      name: req.body.name,
    },
  });
  if (existingFish) return res.status(400).send("Fish already exists!");

  const existingFood = await prisma.food.findFirst({
    where: {
      name: req.body.food.name,
    },
  });
  if (!existingFood) return res.status(400).send("Food doesn't exist!");

  const fish = await prisma.fish.create({
    data: {
      name: req.body.name,
      weeks: req.body.weeks,
      weights: req.body.weights,
      Food: {
        connect: {
          id: existingFood.id,
        },
      },
    },
  });

  if (!fish) return res.status(400).send("Prisma error creation!");
  res.json(fish);
});

module.exports = router;
