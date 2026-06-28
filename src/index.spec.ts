import request from "supertest";
import app from "./index.js";

describe("Health Check", () => {
  it("should return 200 OK and status JSON", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("timestamp");
  });
});
