import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import type { IDashboardRepository } from "../domain/Dashboard.js";
import { DashboardSummary } from "../domain/Dashboard.js";

export interface IGetDashboardSummaryUseCase {
  execute(): Promise<DashboardSummary>;
}

@injectable()
export class GetDashboardSummaryUseCase implements IGetDashboardSummaryUseCase {
  constructor(
    @inject(TOKENS.DashboardRepository) private dashboardRepository: IDashboardRepository
  ) {}

  async execute(): Promise<DashboardSummary> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return this.dashboardRepository.getSummary(startOfDay, endOfDay);
  }
}
