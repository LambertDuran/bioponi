const { validate, generateAuthToken } = require("../controllers/user");
import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
import { pick } from "lodash";
import { PrismaClient } from "@prisma/client";

import defaultFood from "../defaultData/defaultFood.json";
import taec from "../defaultData/taec.json";
import saumon from "../defaultData/saumon.json";
import carpe from "../defaultData/carpe.json";
import tilapia from "../defaultData/tilapia.json";
import sandre from "../defaultData/sandre.json";

const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  // 1. Create a new user
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingUser = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser)
    return res.status(400).send("Utilisateur déjà enregistré !");

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = await prisma.user.create({
    data: pick(req.body, ["email", "password", "name", "isAdmin"]),
  });
  if (!user)
    return res.status(400).send("Erreur dans la création de l'utilisateur !");

  // 2. Create a default food
  const food = await prisma.food.create({
    data: {
      ...defaultFood,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  if (!food)
    return res
      .status(400)
      .send("Erreur dans la création de l'aliment par défaut !");

  // 3. Create default fishes
  const prismaTaec = await prisma.fish.create({
    data: {
      ...taec,
      user: {
        connect: {
          id: user.id,
        },
      },
      food: {
        connect: {
          id: food.id,
        },
      },
    },
  });

  if (!prismaTaec)
    return res
      .status(400)
      .send("Erreur dans la création des poissons par défaut !");

  const prismaSaumon = await prisma.fish.create({
    data: {
      ...saumon,
      user: {
        connect: {
          id: user.id,
        },
      },
      food: {
        connect: {
          id: food.id,
        },
      },
    },
  });
  if (!prismaSaumon)
    return res
      .status(400)
      .send("Erreur dans la création des poissons par défaut !");

  const prismaCarpe = await prisma.fish.create({
    data: {
      ...carpe,
      user: {
        connect: {
          id: user.id,
        },
      },
      food: {
        connect: {
          id: food.id,
        },
      },
    },
  });
  if (!prismaCarpe)
    return res
      .status(400)
      .send("Erreur dans la création des poissons par défaut !");

  const prismaTilapia = await prisma.fish.create({
    data: {
      ...tilapia,
      user: {
        connect: {
          id: user.id,
        },
      },
      food: {
        connect: {
          id: food.id,
        },
      },
    },
  });
  if (!prismaTilapia)
    return res
      .status(400)
      .send("Erreur dans la création des poissons par défaut !");

  const prismaSandre = await prisma.fish.create({
    data: {
      ...sandre,
      user: {
        connect: {
          id: user.id,
        },
      },
      food: {
        connect: {
          id: food.id,
        },
      },
    },
  });
  if (!prismaSandre)
    return res
      .status(400)
      .send("Erreur dans la création des poissons par défaut !");

  // 4. Create default pool
  const pool = await prisma.pool.create({
    data: {
      number: 1,
      volume: 10,
      densityMin: 25,
      densityMax: 60,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  if (!pool)
    return res
      .status(400)
      .send("Erreur dans la création du bassin par défaut !");

  return res
    .header("x-auth-token", generateAuthToken(user))
    .json(pick(user, ["id", "email", "password", "name", "isAdmin"]));
});

module.exports = router;
