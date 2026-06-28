import { Request, Response, NextFunction } from "express";
import { supabase } from "../supabase.js";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      auth?: any;
      user?: any;
    }
  }
}

export async function supabaseAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Missing or invalid authorization token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ code: "UNAUTHORIZED", message: error?.message || "Invalid user session" });
      return;
    }

    req.auth = data.user;
    req.user = data.user;
    next();
  } catch (err: any) {
    res.status(401).json({ code: "UNAUTHORIZED", message: err.message || "Unauthorized" });
  }
}
