import { Router } from "express";
import { MenuController } from "./MenuController.js";
import { supabaseAuthMiddleware } from "../../../../core/security/supabaseAuthMiddleware.js";

const router = Router();

// Apply auth middleware to all menu routes
router.use(supabaseAuthMiddleware);

router.get("/", MenuController.getAll);
router.get("/:id", MenuController.getById);
router.post("/", MenuController.create);
router.put("/:id", MenuController.update);
router.delete("/:id", MenuController.delete);

export default router;
