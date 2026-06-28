import { Menu } from "./Menu.js";

export interface IMenuRepository {
  findAll(search?: string, kategori?: string): Promise<Menu[]>;
  findById(id: string): Promise<Menu | null>;
  save(menu: Omit<Menu, "id" | "created_at" | "updated_at">): Promise<Menu>;
  update(id: string, data: Partial<Omit<Menu, "id" | "created_at" | "updated_at">>): Promise<Menu | null>;
  delete(id: string): Promise<boolean>;
}
