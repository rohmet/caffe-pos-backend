import { registry } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { LoginUseCase, LogoutUseCase } from "../application/AuthUseCases.js";

@registry([
  { token: TOKENS.LoginUseCase, useClass: LoginUseCase },
  { token: TOKENS.LogoutUseCase, useClass: LogoutUseCase },
])
export class AuthRegistry {}
