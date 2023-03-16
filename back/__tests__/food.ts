import * as http from "http";
// import prisma from "./client";
const request = require("supertest");

let server: http.Server;

// const iFood0 = {
//   id: 0,
//   name: "",
//   froms: [10],
//   tos: [100],
//   ranges: ["NEO CDC CF 20"],
//   sizes: [5.5],
//   foodRates: [1.55],
//   prices: [2100],
//   distributions: [100],
// };

// // create food
// await prisma.food.createMany({
//   data: [iFood0],
// });

// console.log("✨ 1 food successfully created! ✨");

// const deleteFoods = prisma.food.deleteMany();
// await prisma.$transaction([deleteFoods]);
// await prisma.$disconnect();

beforeEach(async () => {
  server = require("../index");
});

afterEach(async () => {
  await server.close();
});

describe("GET /api/food", () => {
  it("should return 200", async () => {
    const res = await request(server).get("/api/food");
    expect(res.status).toBe(200);
  });
});
