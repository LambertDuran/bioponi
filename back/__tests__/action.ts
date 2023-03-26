import * as http from "http";
const request = require("supertest");
import prisma from "../src/prismaClient";
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

const pool = {
  id: 0,
  number: 1,
  volume: 10,
};

const action = {
  id: 0,
  type: "Entrée du lot",
  date: Date(),
  totalWeight: 100,
  fishNumber: 200,
  averageWeight: 500,
  fish: fish,
  fishId: 0,
  lotName: "Lot 1",
  pool: pool,
  poolId: 0,
};

beforeEach(async () => {
  server = require("../index");

  const resAction = await prisma.action.create({
    data: {
      type: action.type,
      date: action.date,
      totalWeight: action.totalWeight,
      fishNumber: action.fishNumber,
      averageWeight: action.averageWeight,
      lotName: action.lotName,
      fish: {
        create: {
          name: fish.name,
          weeks: fish.weeks,
          weights: fish.weights,
          food: {
            create: food,
          },
        },
      },
      pool: {
        create: pool,
      },
    },
    include: {
      fish: {
        include: {
          food: true,
        },
      },
      pool: true,
    },
  });

  if (resAction) {
    action.id = resAction.id;
    action.fish = resAction.fish;
    action.fishId = resAction.fishId;
    action.pool = resAction.pool;
    action.poolId = resAction.poolId;
  }
});

afterEach(async () => {
  const deleteActions = prisma.action.deleteMany();
  await prisma.$transaction([deleteActions]);
  await prisma.$disconnect();
});

describe("GET /api/action", () => {
  it("should return 200 if action is valid", async () => {
    const res = await request(server).get("/api/action");
    expect(res.status).toBe(200);
  });
});
