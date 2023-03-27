import * as http from "http";
const request = require("supertest");
import prisma from "../src/prismaClient";
// import { Prisma } from "@prisma/client";
let server: http.Server;

const food = {
  name: "Aliment Sole meunière",
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
  id: 0,
  weeks: [4],
  weights: [200],
  food: food,
  foodId: 0,
};

beforeEach(async () => {
  server = require("../index");

  const existingFood = await prisma.food.create({
    data: {
      name: food.name,
      froms: food.froms,
      tos: food.tos,
      ranges: food.ranges,
      sizes: food.sizes,
      foodRates: food.foodRates,
      prices: food.prices,
      distributions: food.distributions,
    },
  });

  console.log("existingFood - id", existingFood.id);

  const resFish = await prisma.fish.create({
    data: {
      name: fish.name,
      weeks: fish.weeks,
      weights: fish.weights,
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

  console.log("resFish - id", resFish.id);

  if (resFish) {
    fish.id = resFish.id;
    fish.food = resFish.food;
    fish.foodId = resFish.foodId;
  }
});

afterEach(async () => {
  const deleteFishes = await prisma.fish.deleteMany();
  const deleteFoods = await prisma.food.deleteMany();
  // await prisma.$transaction([deleteFishes, deleteFoods], {
  //   isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
  // });
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

describe("PUT /api/fish/:id", () => {
  it("should return 404 if fish not found", async () => {
    const res = await request(server)
      .put(`/api/fish/${fish.id + 1}`)
      .send({ ...fish, name: "autre poisson" });
    expect(res.status).toBe(404);
  });

  it("should return 400 if bad name", async () => {
    const res = await request(server)
      .put(`/api/fish/${fish.id}`)
      .send({ ...fish, name: "" });
    expect(res.status).toBe(400);
  });

  it("should return 400 if bad weeks", async () => {
    const res = await request(server)
      .put(`/api/fish/${fish.id}`)
      .send({ ...fish, weeks: [-1] });
    expect(res.status).toBe(400);
  });

  it("should return 400 if bad weights", async () => {
    const res = await request(server)
      .put(`/api/fish/${fish.id}`)
      .send({ ...fish, weights: [-1] });
    expect(res.status).toBe(400);
  });

  it("should return 400 if bad food", async () => {
    const res = await request(server)
      .put(`/api/fish/${fish.id}`)
      .send({ ...fish, food: { ...food, name: "" } });
    expect(res.status).toBe(400);
  });

  it("should return 200 if fish is valid", async () => {
    const res = await request(server)
      .put(`/api/fish/${fish.id}`)
      .send({ ...fish, name: "autre poisson" });
    expect(res.status).toBe(200);
  });
});
