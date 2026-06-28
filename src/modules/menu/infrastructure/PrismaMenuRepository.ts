import type { IMenuRepository } from "../domain/IMenuRepository.js";
import { Menu } from "../domain/Menu.js";
import { prisma } from "../../../core/db.js";

export class PrismaMenuRepository implements IMenuRepository {
  private toEntity(record: any): Menu {
    return new Menu(
      record.id,
      record.nama,
      record.kategori,
      record.harga_dasar,
      record.surcharge_m,
      record.surcharge_l,
      record.deskripsi,
      record.url_foto,
      record.tersedia,
      record.created_at,
      record.updated_at
    );
  }

  async findAll(search?: string, kategori?: string): Promise<Menu[]> {
    const where: any = {};
    if (search) {
      where.nama = {
        contains: search,
        mode: "insensitive",
      };
    }
    if (kategori) {
      where.kategori = kategori;
    }

    const records = await prisma.menu.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    return records.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<Menu | null> {
    const record = await prisma.menu.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.toEntity(record);
  }

  async save(menu: Omit<Menu, "id" | "created_at" | "updated_at">): Promise<Menu> {
    const record = await prisma.menu.create({
      data: {
        nama: menu.nama,
        kategori: menu.kategori,
        harga_dasar: menu.harga_dasar,
        surcharge_m: menu.surcharge_m,
        surcharge_l: menu.surcharge_l,
        deskripsi: menu.deskripsi,
        url_foto: menu.url_foto,
        tersedia: menu.tersedia,
      },
    });
    return this.toEntity(record);
  }

  async update(id: string, data: Partial<Omit<Menu, "id" | "created_at" | "updated_at">>): Promise<Menu | null> {
    const record = await prisma.menu.update({
      where: { id },
      data,
    });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.menu.delete({
      where: { id },
    });
    return true;
  }
}
