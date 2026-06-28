import { Router } from "express";
import { DashboardController } from "./DashboardController.js";
import { supabaseAuthMiddleware } from "../../../../core/security/supabaseAuthMiddleware.js";

const router = Router();

router.get("/summary", supabaseAuthMiddleware, DashboardController.getSummary);

export default router;
