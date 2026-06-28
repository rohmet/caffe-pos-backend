export class TransaksiItem {
  constructor(
    public readonly id: string,
    public readonly transaksi_id: string,
    public readonly menu_id: string | null,
    public readonly nama_menu: string,
    public readonly harga_satuan: number,
    public readonly ukuran: string,
    public readonly jumlah: number
  ) {}
}

export class Transaksi {
  constructor(
    public readonly id: string,
    public readonly no_invoice: string,
    public readonly total: number,
    public readonly bayar: number,
    public readonly kembalian: number,
    public readonly cashier_id: string | null,
    public readonly created_at: Date,
    public readonly items: TransaksiItem[] = []
  ) {}
}

export interface ITransaksiRepository {
  save(
    transaksi: Omit<Transaksi, "id" | "created_at" | "items">,
    items: Omit<TransaksiItem, "id" | "transaksi_id">[]
  ): Promise<Transaksi>;
  findAll(): Promise<Transaksi[]>;
  findById(id: string): Promise<Transaksi | null>;
}
