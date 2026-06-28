import { Router } from "express";
import { TransaksiController } from "./TransaksiController.js";
import { supabaseAuthMiddleware } from "../../../../core/security/supabaseAuthMiddleware.js";

const router = Router();

// Apply auth middleware to all transaction routes
router.use(supabaseAuthMiddleware);

router.get("/", TransaksiController.getAll);
router.get("/:id", TransaksiController.getById);
router.post("/", TransaksiController.create);

export default router;
