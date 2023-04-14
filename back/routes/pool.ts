const { validatePool } = require("../controllers/pool");
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/", async (req: any, res: Response, next: NextFunction) => {
  const pool = await prisma.pool.findMany({
    where: { userId: req.user.id },
    include: { action: true },
    orderBy: { number: "asc" },
  });
  if (pool.length < 1) return res.status(404).send("Aucun bassin trouvé!");
  res.json(pool);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const pool = await prisma.pool.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      action: true,
    },
  });
  if (!pool) return res.status(404).send("Bassin non trouvé!");
  res.json(pool);
});

router.post("/", async (req: any, res: Response, next: NextFunction) => {
  const { error } = validatePool(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingPool = await prisma.pool.findFirst({
    where: {
      number: req.body.number,
      userId: req.user.id,
    },
  });
  if (existingPool) return res.status(400).send("Bassin déjà existant!");

  const pool = await prisma.pool.create({
    data: {
      number: req.body.number,
      volume: req.body.volume,
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });

  if (!pool) return res.status(400).send("Erreur de création prisma!");
  res.json(pool);
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validatePool(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingPool = await prisma.pool.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!existingPool) return res.status(404).send("Bassin non trouvé!");

  const pool = await prisma.pool.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      number: req.body.number,
      volume: req.body.volume,
      densityMin: req.body.densityMin,
      densityMax: req.body.densityMax,
    },
  });

  if (!pool) return res.status(404).send("Bassin non trouvé!");
  res.json(pool);
});

module.exports = router;
