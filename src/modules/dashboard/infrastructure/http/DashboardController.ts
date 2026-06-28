import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import type { IGetDashboardSummaryUseCase } from "../../application/DashboardUseCases.js";

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = container.resolve<IGetDashboardSummaryUseCase>(TOKENS.GetDashboardSummaryUseCase);
      const summary = await useCase.execute();
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }
}
