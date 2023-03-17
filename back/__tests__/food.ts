import * as http from "http";
import { PrismaClient } from "@prisma/client";
const request = require("supertest");

let server: http.Server;
const prisma = new PrismaClient();

beforeEach(async () => {
  server = require("../index");

  await prisma.food.create({
    data: {
      name: "aliment TAEC",
      froms: [10],
      tos: [100],
      ranges: ["NEO CDC CF 20"],
      sizes: [5.5],
      foodRates: [1.55],
      prices: [2100],
      distributions: [100],
    },
  });
});

afterEach(async () => {
  const deleteFoods = prisma.food.deleteMany();
  await prisma.$transaction([deleteFoods]);
  await prisma.$disconnect();
});

describe("GET /api/food", () => {
  it("should return 200", async () => {
    const res = await request(server).get("/api/food");
    expect(res.status).toBe(200);
  });

  it("should return 404", async () => {
    await prisma.food.deleteMany();
    const res = await request(server).get("/api/food");
    expect(res.status).toBe(404);
  });
});
