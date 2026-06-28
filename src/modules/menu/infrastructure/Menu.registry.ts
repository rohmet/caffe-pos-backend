import { registry } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { PrismaMenuRepository } from "./PrismaMenuRepository.js";
import {
  GetMenusUseCase,
  GetMenuByIdUseCase,
  CreateMenuUseCase,
  UpdateMenuUseCase,
  DeleteMenuUseCase,
  MenuPublicApi,
} from "../application/MenuUseCases.js";

@registry([
  { token: TOKENS.MenuRepository, useClass: PrismaMenuRepository },
  { token: TOKENS.GetMenusUseCase, useClass: GetMenusUseCase },
  { token: TOKENS.GetMenuByIdUseCase, useClass: GetMenuByIdUseCase },
  { token: TOKENS.CreateMenuUseCase, useClass: CreateMenuUseCase },
  { token: TOKENS.UpdateMenuUseCase, useClass: UpdateMenuUseCase },
  { token: TOKENS.DeleteMenuUseCase, useClass: DeleteMenuUseCase },
  { token: TOKENS.MenuPublicApi, useClass: MenuPublicApi },
])
export class MenuRegistry {}
