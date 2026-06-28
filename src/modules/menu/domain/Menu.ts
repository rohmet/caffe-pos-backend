export class Menu {
  constructor(
    public readonly id: string,
    public readonly nama: string,
    public readonly kategori: string,
    public readonly harga_dasar: number,
    public readonly surcharge_m: number,
    public readonly surcharge_l: number,
    public readonly deskripsi: string | null,
    public readonly url_foto: string | null,
    public readonly tersedia: boolean,
    public readonly created_at: Date,
    public readonly updated_at: Date
  ) {}
}
