import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import { pick } from "lodash";
const { validate } = require("../controllers/user");

const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingUser = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) return res.status(400).send("User already registered!");

  const user = await prisma.user.create({
    data: pick(req.body, ["email", "password", "name", "isAdmin"]),
  });
  if (!user) return res.status(400).send("User failed to be created !");

  res.json(pick(user, ["id", "email", "password", "name", "isAdmin"]));
});

module.exports = router;
