import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { z } from "zod";
import type {
  ICreateTransaksiUseCase,
  IGetSemuaTransaksiUseCase,
  IGetDetailTransaksiUseCase,
} from "../../application/TransaksiUseCases.js";

// Input Validation Schemas
export const CreateTransaksiSchema = z.object({
  bayar: z.number().int().positive("Uang bayar harus berupa bilangan bulat positif"),
  items: z
    .array(
      z.object({
        menu_id: z.string().uuid("ID menu harus berupa UUID"),
        ukuran: z.enum(["S", "M", "L"], {
          errorMap: () => ({ message: "Ukuran harus salah satu dari 'S', 'M', 'L'" }),
        }),
        jumlah: z.number().int().positive("Jumlah item minimal 1"),
      })
    )
    .min(1, "Transaksi harus memiliki minimal 1 item"),
});

export class TransaksiController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<ICreateTransaksiUseCase>(TOKENS.CreateTransaksiUseCase);
    try {
      const parsed = CreateTransaksiSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          code: "BAD_REQUEST",
          message: "Validation failed",
          errors: parsed.error.format(),
        });
        return;
      }

      // Get cashier ID from the authenticated user
      const cashierId = req.user?.id || null;

      const result = await useCase.execute({
        bayar: parsed.data.bayar,
        items: parsed.data.items,
        cashier_id: cashierId,
      });

      res.status(201).json(result);
    } catch (error: any) {
      const message = error.message || "";
      if (message.includes("tidak ditemukan") || message.includes("not found")) {
        res.status(404).json({ code: "NOT_FOUND", message });
      } else if (
        message.includes("kurang dari") ||
        message.includes("minimal 1") ||
        message.includes("tidak tersedia")
      ) {
        res.status(400).json({ code: "BAD_REQUEST", message });
      } else {
        next(error);
      }
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<IGetSemuaTransaksiUseCase>(TOKENS.GetSemuaTransaksiUseCase);
    try {
      const result = await useCase.execute();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<IGetDetailTransaksiUseCase>(TOKENS.GetDetailTransaksiUseCase);
    try {
      const id = req.params.id as string;
      const result = await useCase.execute(id);
      res.status(200).json(result);
    } catch (error: any) {
      const message = error.message || "";
      if (message.includes("tidak ditemukan") || message.includes("not found")) {
        res.status(404).json({ code: "NOT_FOUND", message });
      } else {
        next(error);
      }
    }
  }
}
