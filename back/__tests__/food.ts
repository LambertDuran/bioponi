import * as http from "http";
import { PrismaClient } from "@prisma/client";
const request = require("supertest");

let server: http.Server;
const prisma = new PrismaClient();

// const deleteFoods = prisma.food.deleteMany();
// await prisma.$transaction([deleteFoods]);
// await prisma.$disconnect();

beforeAll(async () => {
  server = require("../index");

  const iFood0 = {
    name: "",
    froms: [10],
    tos: [100],
    ranges: ["NEO CDC CF 20"],
    sizes: [5.5],
    foodRates: [1.55],
    prices: [2100],
    distributions: [100],
  };

  // create food
  const res = await prisma.food.create({
    data: iFood0,
  });

  console.log("✨ 1 food successfully created ! ✨");
});

afterAll(async () => {
  const deleteFoods = prisma.food.deleteMany();
  await prisma.$transaction([deleteFoods]);
  await prisma.$disconnect();
  await server.close();
});

describe("GET /api/food", () => {
  it("should return 200", async () => {
    const res = await request(server).get("/api/food");
    expect(res.status).toBe(200);
  });
});
