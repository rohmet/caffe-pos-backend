import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/core/di/tokens.js";
import type { ITransaksiRepository } from "../domain/Transaksi.js";
import { Transaksi } from "../domain/Transaksi.js";
import type { IMenuPublicApi } from "@/modules/menu/application/MenuUseCases.js";

export interface TransaksiItemInputDTO {
  menu_id: string;
  ukuran: "S" | "M" | "L";
  jumlah: number;
}

export interface CreateTransaksiDTO {
  bayar: number;
  items: TransaksiItemInputDTO[];
  cashier_id: string | null;
}

export interface ICreateTransaksiUseCase {
  execute(dto: CreateTransaksiDTO): Promise<Transaksi>;
}

export interface IGetSemuaTransaksiUseCase {
  execute(): Promise<Transaksi[]>;
}

export interface IGetDetailTransaksiUseCase {
  execute(id: string): Promise<Transaksi>;
}

@injectable()
export class CreateTransaksiUseCase implements ICreateTransaksiUseCase {
  constructor(
    @inject(TOKENS.TransaksiRepository) private transaksiRepository: ITransaksiRepository,
    @inject(TOKENS.MenuPublicApi) private menuPublicApi: IMenuPublicApi
  ) {}

  async execute(dto: CreateTransaksiDTO): Promise<Transaksi> {
    if (!dto.items || dto.items.length === 0) {
      throw new Error("Transaksi harus memiliki minimal 1 item");
    }

    let total = 0;
    const itemsToSave = [];

    for (const item of dto.items) {
      const menu = await this.menuPublicApi.getMenuById(item.menu_id);
      if (!menu) {
        throw new Error(`Menu dengan ID ${item.menu_id} tidak ditemukan`);
      }
      if (!menu.tersedia) {
        throw new Error(`Menu '${menu.nama}' saat ini tidak tersedia`);
      }
      if (item.jumlah < 1) {
        throw new Error(`Jumlah untuk menu '${menu.nama}' minimal 1`);
      }

      let surcharge = 0;
      if (item.ukuran === "M") {
        surcharge = menu.surcharge_m;
      } else if (item.ukuran === "L") {
        surcharge = menu.surcharge_l;
      }

      const hargaSatuan = menu.harga_dasar + surcharge;
      const subtotal = hargaSatuan * item.jumlah;
      total += subtotal;

      itemsToSave.push({
        menu_id: menu.id,
        nama_menu: menu.nama,
        harga_satuan: hargaSatuan,
        ukuran: item.ukuran,
        jumlah: item.jumlah,
      });
    }

    if (dto.bayar < total) {
      throw new Error(`Uang bayar (${dto.bayar}) kurang dari total belanja (${total})`);
    }

    const kembalian = dto.bayar - total;

    // Generate invoice number: INV-YYYYMMDD-XXXX
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const noInvoice = `INV-${datePart}-${randomPart}`;

    return this.transaksiRepository.save(
      {
        no_invoice: noInvoice,
        total,
        bayar: dto.bayar,
        kembalian,
        cashier_id: dto.cashier_id,
      },
      itemsToSave
    );
  }
}

@injectable()
export class GetSemuaTransaksiUseCase implements IGetSemuaTransaksiUseCase {
  constructor(
    @inject(TOKENS.TransaksiRepository) private transaksiRepository: ITransaksiRepository
  ) {}

  async execute(): Promise<Transaksi[]> {
    return this.transaksiRepository.findAll();
  }
}

@injectable()
export class GetDetailTransaksiUseCase implements IGetDetailTransaksiUseCase {
  constructor(
    @inject(TOKENS.TransaksiRepository) private transaksiRepository: ITransaksiRepository
  ) {}

  async execute(id: string): Promise<Transaksi> {
    const transaksi = await this.transaksiRepository.findById(id);
    if (!transaksi) {
      throw new Error(`Transaksi dengan ID ${id} tidak ditemukan`);
    }
    return transaksi;
  }
}
