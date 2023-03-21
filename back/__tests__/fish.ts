import * as http from "http";
import { PrismaClient } from "@prisma/client";
const request = require("supertest");

let server: http.Server;
const prisma = new PrismaClient();

const food = {
  name: "Aliment Sole",
  froms: [10],
  tos: [100],
  ranges: ["NEO CDC CF 20"],
  sizes: [5.5],
  foodRates: [1.55],
  prices: [2100],
  distributions: [100],
};

const fish = {
  name: "Sole",
  weeks: [4],
  weights: [200],
  food: food,
};

beforeEach(async () => {
  server = require("../index");

  await prisma.fish.create({
    data: {
      name: fish.name,
      weeks: fish.weeks,
      weights: fish.weights,
      food: {
        create: food,
      },
    },
  });
});

afterEach(async () => {
  const deleteFishes = prisma.fish.deleteMany();
  const deleteFoods = prisma.food.deleteMany();
  await prisma.$transaction([deleteFishes, deleteFoods]);
  await prisma.$disconnect();
});

// GET
describe("GET /api/fish", () => {
  it("should return 200 if fish is valid", async () => {
    const res = await request(server).get("/api/fish");
    expect(res.status).toBe(200);
  });
});

// POST
describe("POST /api/fish", () => {
  it("should return 400 if bad name", async () => {
    const res = await request(server)
      .post("/api/fish")
      .send({ ...fish, name: "" });
    expect(res.status).toBe(400);
  });

  it("should return 400 if bad weeks", async () => {
    const res = await request(server)
      .post("/api/fish")
      .send({ ...fish, weeks: [-1] });
    expect(res.status).toBe(400);
  });

  it("should return 400 if bad weights", async () => {
    const res = await request(server)
      .post("/api/fish")
      .send({ ...fish, weights: [-1] });
    expect(res.status).toBe(400);
  });

  it("should return 400 if bad food", async () => {
    const res = await request(server)
      .post("/api/fish")
      .send({ ...fish, food: { ...food, name: "" } });
    expect(res.status).toBe(400);
  });

  it("should return 200 if fish is valid", async () => {
    const res = await request(server)
      .post("/api/fish")
      .send({ ...fish, name: "autre poisson" });
    expect(res.status).toBe(200);
  });
});
