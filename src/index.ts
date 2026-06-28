import "reflect-metadata";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import "./modules/auth/infrastructure/Auth.registry.js";
import { AuthController } from "./modules/auth/infrastructure/http/AuthController.js";
import { supabaseAuthMiddleware } from "./core/security/supabaseAuthMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8001;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth Routes
app.post("/api/auth/login", AuthController.login);
app.post("/api/auth/logout", AuthController.logout);

// Protected Test Route (ponytail: verification check helper)
app.get("/api/protected-test", supabaseAuthMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ message: "Authenticated successfully", user: req.user });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res
    .status(500)
    .json({ code: "INTERNAL_SERVER_ERROR", message: err.message || "Internal server error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
