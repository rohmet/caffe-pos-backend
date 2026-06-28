import { IDashboardRepository, DashboardSummary, MenuTerlaris } from "../domain/Dashboard.js";
import { prisma } from "../../../core/db.js";

export class PrismaDashboardRepository implements IDashboardRepository {
  async getSummary(startOfDay: Date, endOfDay: Date): Promise<DashboardSummary> {
    const totalTransaksiHariIni = await prisma.transaksi.count({
      where: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const aggregatePendapatan = await prisma.transaksi.aggregate({
      _sum: {
        total: true,
      },
      where: {
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    const totalPendapatanHariIni = aggregatePendapatan._sum.total || 0;

    const items = await prisma.transaksiItem.groupBy({
      by: ["nama_menu"],
      _sum: {
        jumlah: true,
      },
      where: {
        transaksi: {
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      },
      orderBy: {
        _sum: {
          jumlah: "desc",
        },
      },
      take: 5,
    });

    const menuTerlarisHariIni: MenuTerlaris[] = items.map((item) => ({
      nama_menu: item.nama_menu,
      total_terjual: item._sum.jumlah || 0,
    }));

    return new DashboardSummary(totalPendapatanHariIni, totalTransaksiHariIni, menuTerlarisHariIni);
  }
}
