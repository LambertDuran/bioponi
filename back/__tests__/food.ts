import * as http from "http";
const request = require("supertest");
import prisma from "../src/prismaClient";
let server: http.Server;

const food = {
  id: 0,
  name: "aliment TAEC",
  froms: [10],
  tos: [100],
  ranges: ["NEO CDC CF 20"],
  sizes: [5.5],
  foodRates: [1.55],
  prices: [2100],
  distributions: [100],
};

beforeEach(async () => {
  server = require("../index");

  const resFood = await prisma.food.create({
    data: food,
  });
  if (resFood) food.id = resFood.id;
});

afterEach(async () => {
  const deleteFoods = prisma.food.deleteMany();
  await prisma.$transaction([deleteFoods]);
  await prisma.$disconnect();
});

// GET
describe("GET /api/food", () => {
  it("should return 200 if food is valid", async () => {
    const res = await request(server).get("/api/food");
    expect(res.status).toBe(200);
  });
});

// POST
describe("POST /api/food", () => {
  it("should return 400 if bad name", async () => {
    const res = await request(server)
      .post("/api/food")
      .send({ ...food, name: "" });
    expect(res.status).toBe(400);
  });

  it("should return 400 if negative value", async () => {
    const res = await request(server)
      .post("/api/food")
      .send({ ...food, froms: [-1] });
    expect(res.status).toBe(400);
  });

  it("should return 400 if to superior to from", async () => {
    const res = await request(server)
      .post("/api/food")
      .send({ ...food, froms: [20], tos: [10] });
    expect(res.status).toBe(400);
  });

  it("should return 400 if already existing food", async () => {
    const res = await request(server).post("/api/food").send(food);
    expect(res.status).toBe(400);
  });

  it("should return 200 if food is valid", async () => {
    const res = await request(server)
      .post("/api/food")
      .send({ ...food, name: "nouvel aliment", id: 0 });
    expect(res.status).toBe(200);
  });
});

// PUT
describe("PUT /api/food/:id", () => {
  it("should return 404 if food not found", async () => {
    const res = await request(server)
      .put(`/api/food/${food.id + 1}`)
      .send({ ...food, name: "autre aliment" });
    expect(res.status).toBe(404);
  });

  it("should return 400 if bad name", async () => {
    const res = await request(server)
      .put(`/api/food/${food.id}}`)
      .send({ ...food, name: "" });
    expect(res.status).toBe(400);
  });

  it("should return 400 if negative value", async () => {
    const res = await request(server)
      .put(`/api/food/${food.id}`)
      .send({ ...food, froms: [-1] });
    expect(res.status).toBe(400);
  });

  it("should return 400 if to superior to from", async () => {
    const res = await request(server)
      .put(`/api/food/${food.id}`)
      .send({ ...food, froms: [20], tos: [10] });
    expect(res.status).toBe(400);
  });

  it("should return 200 if food is valid", async () => {
    const res = await request(server)
      .put(`/api/food/${food.id}`)
      .send({ ...food, name: "autre aliment" });
    expect(res.status).toBe(200);
  });
});
