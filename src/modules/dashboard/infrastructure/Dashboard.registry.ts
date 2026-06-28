import { registry } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { PrismaDashboardRepository } from "./PrismaDashboardRepository.js";
import { GetDashboardSummaryUseCase } from "../application/DashboardUseCases.js";

@registry([
  { token: TOKENS.DashboardRepository, useClass: PrismaDashboardRepository },
  { token: TOKENS.GetDashboardSummaryUseCase, useClass: GetDashboardSummaryUseCase },
])
export class DashboardRegistry {}
