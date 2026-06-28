import { ITransaksiRepository, Transaksi, TransaksiItem } from "../domain/Transaksi.js";
import { prisma } from "../../../core/db.js";

export class PrismaTransaksiRepository implements ITransaksiRepository {
  private toEntity(record: any): Transaksi {
    const items = record.items
      ? record.items.map(
          (item: any) =>
            new TransaksiItem(
              item.id,
              item.transaksi_id,
              item.menu_id,
              item.nama_menu,
              item.harga_satuan,
              item.ukuran,
              item.jumlah
            )
        )
      : [];
    return new Transaksi(
      record.id,
      record.no_invoice,
      record.total,
      record.bayar,
      record.kembalian,
      record.cashier_id,
      record.created_at,
      items
    );
  }

  async save(
    transaksi: Omit<Transaksi, "id" | "created_at" | "items">,
    items: Omit<TransaksiItem, "id" | "transaksi_id">[]
  ): Promise<Transaksi> {
    const record = await prisma.transaksi.create({
      data: {
        no_invoice: transaksi.no_invoice,
        total: transaksi.total,
        bayar: transaksi.bayar,
        kembalian: transaksi.kembalian,
        cashier_id: transaksi.cashier_id,
        items: {
          create: items.map((item) => ({
            menu_id: item.menu_id,
            nama_menu: item.nama_menu,
            harga_satuan: item.harga_satuan,
            ukuran: item.ukuran,
            jumlah: item.jumlah,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.toEntity(record);
  }

  async findAll(): Promise<Transaksi[]> {
    const records = await prisma.transaksi.findMany({
      include: {
        items: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return records.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<Transaksi | null> {
    const record = await prisma.transaksi.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!record) return null;
    return this.toEntity(record);
  }
}
