import "reflect-metadata";
import { container } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { Menu } from "./domain/Menu.js";
import type { IMenuRepository } from "./domain/IMenuRepository.js";
import {
  CreateMenuUseCase,
  GetMenusUseCase,
  GetMenuByIdUseCase,
  UpdateMenuUseCase,
  DeleteMenuUseCase,
} from "./application/MenuUseCases.js";

class MockMenuRepository implements IMenuRepository {
  public menus: Menu[] = [];

  async findAll(search?: string, kategori?: string): Promise<Menu[]> {
    let result = this.menus;
    if (search) {
      result = result.filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()));
    }
    if (kategori) {
      result = result.filter((m) => m.kategori === kategori);
    }
    return result;
  }

  async findById(id: string): Promise<Menu | null> {
    return this.menus.find((m) => m.id === id) || null;
  }

  async save(menu: Omit<Menu, "id" | "created_at" | "updated_at">): Promise<Menu> {
    const newMenu = new Menu(
      "test-id",
      menu.nama,
      menu.kategori,
      menu.harga_dasar,
      menu.surcharge_m,
      menu.surcharge_l,
      menu.deskripsi,
      menu.url_foto,
      menu.tersedia,
      new Date(),
      new Date()
    );
    this.menus.push(newMenu);
    return newMenu;
  }

  async update(
    id: string,
    data: Partial<Omit<Menu, "id" | "created_at" | "updated_at">>
  ): Promise<Menu | null> {
    const index = this.menus.findIndex((m) => m.id === id);
    if (index === -1) return null;
    const updated = new Menu(
      id,
      data.nama ?? this.menus[index].nama,
      data.kategori ?? this.menus[index].kategori,
      data.harga_dasar ?? this.menus[index].harga_dasar,
      data.surcharge_m ?? this.menus[index].surcharge_m,
      data.surcharge_l ?? this.menus[index].surcharge_l,
      data.deskripsi ?? this.menus[index].deskripsi,
      data.url_foto ?? this.menus[index].url_foto,
      data.tersedia ?? this.menus[index].tersedia,
      this.menus[index].created_at,
      new Date()
    );
    this.menus[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    this.menus = this.menus.filter((m) => m.id !== id);
    return true;
  }
}

describe("Menu Use Cases", () => {
  let mockRepo: MockMenuRepository;

  beforeEach(() => {
    container.clearInstances();
    mockRepo = new MockMenuRepository();
    container.registerInstance(TOKENS.MenuRepository, mockRepo);
  });

  it("should create a new menu", async () => {
    const useCase = container.resolve(CreateMenuUseCase);
    const menu = await useCase.execute({
      nama: "Kopi Susu",
      kategori: "minuman",
      harga_dasar: 15000,
    });

    expect(menu.id).toBe("test-id");
    expect(menu.nama).toBe("Kopi Susu");
    expect(mockRepo.menus.length).toBe(1);
  });

  it("should list all menus and apply search filters", async () => {
    mockRepo.menus.push(
      new Menu("1", "Kopi", "minuman", 15000, 0, 0, null, null, true, new Date(), new Date()),
      new Menu("2", "Roti", "makanan ringan", 10000, 0, 0, null, null, true, new Date(), new Date())
    );

    const useCase = container.resolve(GetMenusUseCase);
    
    const all = await useCase.execute();
    expect(all.length).toBe(2);

    const filtered = await useCase.execute("kopi");
    expect(filtered.length).toBe(1);
    expect(filtered[0].nama).toBe("Kopi");
  });
});
