import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { ILoginUseCase, ILogoutUseCase } from "../../application/AuthUseCases.js";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const loginUseCase = container.resolve<ILoginUseCase>(TOKENS.LoginUseCase);
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ code: "BAD_REQUEST", message: "Email and password are required" });
        return;
      }
      const result = await loginUseCase.execute(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials") || error.message.includes("does not exist") || error.message.includes("invalid")) {
        res.status(401).json({ code: "UNAUTHORIZED", message: error.message });
      } else {
        next(error);
      }
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const logoutUseCase = container.resolve<ILogoutUseCase>(TOKENS.LogoutUseCase);
    try {
      await logoutUseCase.execute();
      res.status(200).json({ message: "Successfully logged out" });
    } catch (error: any) {
      next(error);
    }
  }
}
