const { validateAction } = require("../controllers/action");
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const action = await prisma.action.findMany({
    include: {
      fish: true,
      pool: true,
      secondPool: true,
    },
  });
  if (action.length < 1) return res.status(404).send("Aucune action trouvée!");
  res.json(action);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const action = await prisma.action.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!action) return res.status(404).send("Action non trouvée!");
  res.json(action);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateAction(req.body);
  console.log("error", error);
  if (error) return res.status(400).send(error.details[0].message);

  const existingAction = await prisma.action.findFirst({
    where: {
      type: req.body.type,
      date: req.body.date,
    },
  });
  if (existingAction) return res.status(400).send("Action déjà existante !");

  let action;
  if (req.body.type === "transfert") {
    if (!req.body.secondPool)
      return res.status(400).send("Donnée manquante: second bassin !");
    action = await prisma.action.create({
      data: {
        type: req.body.type,
        date: req.body.date,
        totalWeight: req.body.totalWeight,
        averageWeight: req.body.averageWeight,
        fishNumber: req.body.fishNumber,
        lotName: req.body.lotName,
        pool: {
          connect: {
            id: req.body.pool.id,
          },
        },
        fish: {
          connect: {
            id: req.body.fish.id,
          },
        },
        secondPool: {
          connect: {
            id: req.body.secondPool.id,
          },
        },
      },
      include: {
        pool: true,
        fish: true,
        secondPool: true,
      },
    });
  } else {
    action = await prisma.action.create({
      data: {
        type: req.body.type,
        date: req.body.date,
        totalWeight: req.body.totalWeight,
        averageWeight: req.body.averageWeight,
        fishNumber: req.body.fishNumber,
        lotName: req.body.lotName,
        pool: {
          connect: {
            id: req.body.pool.id,
          },
        },
        fish: {
          connect: {
            id: req.body.fish.id,
          },
        },
      },
      include: {
        pool: true,
        fish: true,
      },
    });
  }

  if (!action) return res.status(400).send("Erreur de création prisma!");
  res.json(action);
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateAction(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingAction = await prisma.action.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!existingAction) return res.status(404).send("Action non trouvée!");

  const action = await prisma.action.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      type: req.body.type,
      date: req.body.date,
      totalWeight: req.body.totalWeight,
      averageWeight: req.body.averageWeight,
      fishNumber: req.body.fishNumber,
      lotName: req.body.lotName,
      pool: {
        connect: {
          id: req.body.pool.id,
        },
      },
      fish: {
        connect: {
          id: req.body.fish.id,
        },
      },
      secondPool: {
        connect: {
          id: req.body.secondPool.id,
        },
      },
    },
    include: {
      pool: true,
      fish: true,
      secondPool: true,
    },
  });

  if (!action) return res.status(400).send("Erreur de maj prisma!");
  res.json(action);
});

module.exports = router;
