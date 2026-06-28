import { registry } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { PrismaTransaksiRepository } from "./PrismaTransaksiRepository.js";
import {
  CreateTransaksiUseCase,
  GetSemuaTransaksiUseCase,
  GetDetailTransaksiUseCase,
} from "../application/TransaksiUseCases.js";

@registry([
  { token: TOKENS.TransaksiRepository, useClass: PrismaTransaksiRepository },
  { token: TOKENS.CreateTransaksiUseCase, useClass: CreateTransaksiUseCase },
  { token: TOKENS.GetSemuaTransaksiUseCase, useClass: GetSemuaTransaksiUseCase },
  { token: TOKENS.GetDetailTransaksiUseCase, useClass: GetDetailTransaksiUseCase },
])
export class TransaksiRegistry {}
