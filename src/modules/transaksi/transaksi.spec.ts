import "reflect-metadata";
import { container } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import { Transaksi, TransaksiItem, ITransaksiRepository } from "./domain/Transaksi.js";
import { Menu } from "../menu/domain/Menu.js";
import { IMenuPublicApi } from "../menu/application/MenuUseCases.js";
import {
  CreateTransaksiUseCase,
  GetSemuaTransaksiUseCase,
  GetDetailTransaksiUseCase,
} from "./application/TransaksiUseCases.js";

class MockTransaksiRepository implements ITransaksiRepository {
  public transactions: Transaksi[] = [];

  async save(
    transaksi: Omit<Transaksi, "id" | "created_at" | "items">,
    items: Omit<TransaksiItem, "id" | "transaksi_id">[]
  ): Promise<Transaksi> {
    const id = `tx-test-id-${this.transactions.length + 1}`;
    const mappedItems = items.map(
      (item, idx) =>
        new TransaksiItem(
          `item-id-${idx}`,
          id,
          item.menu_id,
          item.nama_menu,
          item.harga_satuan,
          item.ukuran,
          item.jumlah
        )
    );
    const newTx = new Transaksi(
      id,
      transaksi.no_invoice,
      transaksi.total,
      transaksi.bayar,
      transaksi.kembalian,
      transaksi.cashier_id,
      new Date(),
      mappedItems
    );
    this.transactions.push(newTx);
    return newTx;
  }

  async findAll(): Promise<Transaksi[]> {
    return this.transactions;
  }

  async findById(id: string): Promise<Transaksi | null> {
    return this.transactions.find((tx) => tx.id === id) || null;
  }
}

class MockMenuPublicApi implements IMenuPublicApi {
  public menus: Menu[] = [];

  async getMenuById(id: string): Promise<Menu | null> {
    return this.menus.find((m) => m.id === id) || null;
  }
}

describe("Transaksi Use Cases", () => {
  let mockTxRepo: MockTransaksiRepository;
  let mockMenuApi: MockMenuPublicApi;

  beforeEach(() => {
    container.clearInstances();
    mockTxRepo = new MockTransaksiRepository();
    mockMenuApi = new MockMenuPublicApi();
    container.registerInstance(TOKENS.TransaksiRepository, mockTxRepo);
    container.registerInstance(TOKENS.MenuPublicApi, mockMenuApi);
  });

  it("should create transaction successfully with correct calculations and surcharges", async () => {
    mockMenuApi.menus.push(
      new Menu(
        "menu-1",
        "Kopi",
        "minuman",
        10000,
        2000,
        4000,
        null,
        null,
        true,
        new Date(),
        new Date()
      ),
      new Menu(
        "menu-2",
        "Roti",
        "makanan ringan",
        15000,
        0,
        0,
        null,
        null,
        true,
        new Date(),
        new Date()
      )
    );

    const useCase = container.resolve(CreateTransaksiUseCase);
    const tx = await useCase.execute({
      bayar: 50000,
      cashier_id: "cashier-1",
      items: [
        { menu_id: "menu-1", ukuran: "M", jumlah: 2 }, // (10000 + 2000) * 2 = 24000
        { menu_id: "menu-2", ukuran: "S", jumlah: 1 }, // 15000 * 1 = 15000
      ], // total = 39000
    });

    expect(tx.total).toBe(39000);
    expect(tx.bayar).toBe(50000);
    expect(tx.kembalian).toBe(11000);
    expect(tx.items.length).toBe(2);
    expect(tx.items[0].harga_satuan).toBe(12000);
    expect(tx.items[0].nama_menu).toBe("Kopi");
    expect(tx.no_invoice).toContain("INV-");
  });

  it("should throw error if payment is insufficient", async () => {
    mockMenuApi.menus.push(
      new Menu("menu-1", "Kopi", "minuman", 10000, 0, 0, null, null, true, new Date(), new Date())
    );

    const useCase = container.resolve(CreateTransaksiUseCase);
    await expect(
      useCase.execute({
        bayar: 5000,
        cashier_id: "cashier-1",
        items: [{ menu_id: "menu-1", ukuran: "S", jumlah: 1 }],
      })
    ).rejects.toThrow("Uang bayar (5000) kurang dari total belanja (10000)");
  });

  it("should throw error if menu is not available", async () => {
    mockMenuApi.menus.push(
      new Menu("menu-1", "Kopi", "minuman", 10000, 0, 0, null, null, false, new Date(), new Date())
    );

    const useCase = container.resolve(CreateTransaksiUseCase);
    await expect(
      useCase.execute({
        bayar: 20000,
        cashier_id: "cashier-1",
        items: [{ menu_id: "menu-1", ukuran: "S", jumlah: 1 }],
      })
    ).rejects.toThrow("Menu 'Kopi' saat ini tidak tersedia");
  });
});
