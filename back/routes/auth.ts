import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("../controllers/user");
const { validate } = require("../controllers/auth");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(400).send("Invalid email or password!");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password!");

  const token = generateAuthToken(user);
  res.send(token);
});

module.exports = router;
