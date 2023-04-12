const { validateFish } = require("../controllers/fish");
import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/", async (req: any, res: Response) => {
  const fish = await prisma.fish.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      food: true,
    },
  });
  if (fish.length < 1) return res.status(404).send("Aucun poisson trouvé!");
  res.json(fish);
});

router.get("/:id", async (req: Request, res: Response) => {
  const fish = await prisma.fish.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      food: true,
    },
  });
  if (!fish) return res.status(404).send("Poisson non trouvé!");
  res.json(fish);
});

router.post("/", async (req: any, res: Response) => {
  const { error } = validateFish(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingFood = await prisma.food.findFirst({
    where: {
      name: req.body.food.name,
      userId: req.user.id,
    },
  });
  if (!existingFood) return res.status(400).send("Food doesn't exist!");

  const existingFish = await prisma.fish.findFirst({
    where: {
      name: req.body.name,
      userId: req.user.id,
    },
  });
  if (existingFish) return res.status(400).send("Fish already exists!");

  const fish = await prisma.fish.create({
    data: {
      name: req.body.name,
      weeks: req.body.weeks,
      weights: req.body.weights,
      food: {
        connect: {
          id: existingFood.id,
        },
      },
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
    include: {
      food: true,
    },
  });

  if (!fish) return res.status(400).send("Prisma error creation!");
  res.json(fish);
});

router.put("/:id", async (req: any, res: Response) => {
  const { error } = validateFish(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingFish = await prisma.fish.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!existingFish) return res.status(404).send("Fish doesn't exist!");

  const existingFood = await prisma.food.findFirst({
    where: {
      name: req.body.food.name,
      userId: req.user.id,
    },
  });
  if (!existingFood) return res.status(400).send("Food doesn't exist!");

  const fish = await prisma.fish.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      name: req.body.name,
      weeks: req.body.weeks,
      weights: req.body.weights,
      food: {
        connect: {
          id: existingFood.id,
        },
      },
    },
    include: {
      food: true,
    },
  });

  if (!fish) return res.status(400).send("Prisma error update!");
  res.json(fish);
});

module.exports = router;
