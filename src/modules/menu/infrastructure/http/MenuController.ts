import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import type {
  IGetMenusUseCase,
  IGetMenuByIdUseCase,
  ICreateMenuUseCase,
  IUpdateMenuUseCase,
  IDeleteMenuUseCase,
} from "../../application/MenuUseCases.js";
import { CreateMenuSchema, UpdateMenuSchema } from "./MenuValidator.js";

export class MenuController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<IGetMenusUseCase>(TOKENS.GetMenusUseCase);
    try {
      const { search, kategori } = req.query;
      const result = await useCase.execute(
        search ? String(search) : undefined,
        kategori ? String(kategori) : undefined
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<IGetMenuByIdUseCase>(TOKENS.GetMenuByIdUseCase);
    try {
      const id = req.params.id as string;
      const result = await useCase.execute(id);
      res.status(200).json(result);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found")) {
        res.status(404).json({ code: "NOT_FOUND", message: err.message });
      } else {
        next(error);
      }
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<ICreateMenuUseCase>(TOKENS.CreateMenuUseCase);
    try {
      const parsed = CreateMenuSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          code: "BAD_REQUEST",
          message: "Validation failed",
          errors: parsed.error.format(),
        });
        return;
      }
      const result = await useCase.execute(parsed.data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<IUpdateMenuUseCase>(TOKENS.UpdateMenuUseCase);
    try {
      const id = req.params.id as string;
      const parsed = UpdateMenuSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          code: "BAD_REQUEST",
          message: "Validation failed",
          errors: parsed.error.format(),
        });
        return;
      }
      const result = await useCase.execute(id, parsed.data);
      res.status(200).json(result);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found")) {
        res.status(404).json({ code: "NOT_FOUND", message: err.message });
      } else {
        next(error);
      }
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const useCase = container.resolve<IDeleteMenuUseCase>(TOKENS.DeleteMenuUseCase);
    try {
      const id = req.params.id as string;
      await useCase.execute(id);
      res.status(200).json({ message: "Menu successfully deleted" });
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message.includes("not found")) {
        res.status(404).json({ code: "NOT_FOUND", message: err.message });
      } else {
        next(error);
      }
    }
  }
}
