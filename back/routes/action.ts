const { validateAction } = require("../controllers/action");
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async (req: any, res: Response, next: NextFunction) => {
  const actions = await prisma.action.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      fish: true,
      pool: true,
      secondPool: true,
    },
  });
  if (actions.length < 1) return res.status(404).send("Aucune action trouvée!");
  res.json(actions);
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

router.post("/", async (req: any, res: Response, next: NextFunction) => {
  const { error } = validateAction(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let action;

  switch (req.body.type) {
    case "Entrée du lot": {
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
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          pool: true,
          fish: true,
        },
      });
      break;
    }

    case "Pesée":
    case "Vente":
    case "Sortie définitive":
    case "Mortalité": {
      action = await prisma.action.create({
        data: {
          type: req.body.type,
          date: req.body.date,
          totalWeight: req.body.totalWeight,
          averageWeight: req.body.averageWeight,
          fishNumber: req.body.fishNumber,
          pool: {
            connect: {
              id: req.body.pool.id,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          pool: true,
        },
      });
      break;
    }

    case "Transfert": {
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
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          pool: true,
          fish: true,
          secondPool: true,
        },
      });
      break;
    }
  }

  if (!action) return res.status(400).send("Erreur de création prisma!");
  res.json(action);
});

router.put("/:id", async (req: any, res: Response, next: NextFunction) => {
  const { error } = validateAction(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingAction = await prisma.action.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!existingAction) return res.status(404).send("Action non trouvée!");

  let action;
  switch (req.body.type) {
    case "Entrée du lot": {
      action = await prisma.action.update({
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
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          pool: true,
          fish: true,
        },
      });
      break;
    }

    case "Pesée":
    case "Vente":
    case "Sortie définitve":
    case "Mortalité": {
      action = await prisma.action.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          type: req.body.type,
          date: req.body.date,
          totalWeight: req.body.totalWeight,
          averageWeight: req.body.averageWeight,
          fishNumber: req.body.fishNumber,
          pool: {
            connect: {
              id: req.body.pool.id,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          pool: true,
        },
      });
      break;
    }

    case "Transfert": {
      if (!req.body.secondPool)
        return res.status(400).send("Donnée manquante: second bassin !");
      action = await prisma.action.update({
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
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          pool: true,
          fish: true,
          secondPool: true,
        },
      });
      break;
    }
  }

  if (!action) return res.status(400).send("Erreur de maj prisma!");
  res.json(action);
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const action = await prisma.action.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!action) return res.status(404).send("Action non trouvée!");
    res.json(action);
  }
);

module.exports = router;
