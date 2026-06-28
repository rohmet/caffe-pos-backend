export interface MenuTerlaris {
  nama_menu: string;
  total_terjual: number;
}

export class DashboardSummary {
  constructor(
    public readonly totalPendapatanHariIni: number,
    public readonly totalTransaksiHariIni: number,
    public readonly menuTerlarisHariIni: MenuTerlaris[]
  ) {}
}

export interface IDashboardRepository {
  getSummary(startOfDay: Date, endOfDay: Date): Promise<DashboardSummary>;
}
