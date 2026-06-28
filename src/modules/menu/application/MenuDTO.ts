export interface CreateMenuDTO {
  nama: string;
  kategori: string;
  harga_dasar: number;
  surcharge_m?: number;
  surcharge_l?: number;
  deskripsi?: string | null;
  url_foto?: string | null;
  tersedia?: boolean;
}

export interface UpdateMenuDTO {
  nama?: string;
  kategori?: string;
  harga_dasar?: number;
  surcharge_m?: number;
  surcharge_l?: number;
  deskripsi?: string | null;
  url_foto?: string | null;
  tersedia?: boolean;
}
