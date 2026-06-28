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

describe("Authentication integration checks", () => {
  it("should block request without token to protected endpoint with 401", async () => {
    const res = await request(app).get("/api/protected-test");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("code", "UNAUTHORIZED");
  });

  it("should return 400 Bad Request for login attempt with missing credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("code", "BAD_REQUEST");
  });
});
