import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import type { IMenuRepository } from "../domain/IMenuRepository.js";
import { Menu } from "../domain/Menu.js";
import { CreateMenuDTO, UpdateMenuDTO } from "./MenuDTO.js";

export interface IGetMenusUseCase {
  execute(search?: string, kategori?: string): Promise<Menu[]>;
}

export interface IGetMenuByIdUseCase {
  execute(id: string): Promise<Menu>;
}

export interface ICreateMenuUseCase {
  execute(dto: CreateMenuDTO): Promise<Menu>;
}

export interface IUpdateMenuUseCase {
  execute(id: string, dto: UpdateMenuDTO): Promise<Menu>;
}

export interface IDeleteMenuUseCase {
  execute(id: string): Promise<boolean>;
}

@injectable()
export class GetMenusUseCase implements IGetMenusUseCase {
  constructor(
    @inject(TOKENS.MenuRepository) private menuRepository: IMenuRepository
  ) {}

  async execute(search?: string, kategori?: string): Promise<Menu[]> {
    return this.menuRepository.findAll(search, kategori);
  }
}

@injectable()
export class GetMenuByIdUseCase implements IGetMenuByIdUseCase {
  constructor(
    @inject(TOKENS.MenuRepository) private menuRepository: IMenuRepository
  ) {}

  async execute(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new Error(`Menu with ID ${id} not found`);
    }
    return menu;
  }
}

@injectable()
export class CreateMenuUseCase implements ICreateMenuUseCase {
  constructor(
    @inject(TOKENS.MenuRepository) private menuRepository: IMenuRepository
  ) {}

  async execute(dto: CreateMenuDTO): Promise<Menu> {
    return this.menuRepository.save({
      nama: dto.nama,
      kategori: dto.kategori,
      harga_dasar: dto.harga_dasar,
      surcharge_m: dto.surcharge_m ?? 0,
      surcharge_l: dto.surcharge_l ?? 0,
      deskripsi: dto.deskripsi ?? null,
      url_foto: dto.url_foto ?? null,
      tersedia: dto.tersedia ?? true,
    });
  }
}

@injectable()
export class UpdateMenuUseCase implements IUpdateMenuUseCase {
  constructor(
    @inject(TOKENS.MenuRepository) private menuRepository: IMenuRepository
  ) {}

  async execute(id: string, dto: UpdateMenuDTO): Promise<Menu> {
    const existing = await this.menuRepository.findById(id);
    if (!existing) {
      throw new Error(`Menu with ID ${id} not found`);
    }
    const updated = await this.menuRepository.update(id, dto);
    if (!updated) {
      throw new Error(`Failed to update menu with ID ${id}`);
    }
    return updated;
  }
}

@injectable()
export class DeleteMenuUseCase implements IDeleteMenuUseCase {
  constructor(
    @inject(TOKENS.MenuRepository) private menuRepository: IMenuRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.menuRepository.findById(id);
    if (!existing) {
      throw new Error(`Menu with ID ${id} not found`);
    }
    return this.menuRepository.delete(id);
  }
}

export interface IMenuPublicApi {
  getMenuById(id: string): Promise<Menu | null>;
}

@injectable()
export class MenuPublicApi implements IMenuPublicApi {
  constructor(
    @inject(TOKENS.MenuRepository) private menuRepository: IMenuRepository
  ) {}

  async getMenuById(id: string): Promise<Menu | null> {
    return this.menuRepository.findById(id);
  }
}

