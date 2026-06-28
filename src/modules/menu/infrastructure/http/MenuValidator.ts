import { z } from "zod";

export const CreateMenuSchema = z.object({
  nama: z.string().min(3, "Nama menu minimal 3 karakter"),
  kategori: z.enum(["minuman", "makanan ringan"], {
    errorMap: () => ({ message: "Kategori menu harus 'minuman' atau 'makanan ringan'" }),
  }),
  harga_dasar: z.number().positive("Harga menu harus lebih dari 0"),
  surcharge_m: z.number().nonnegative().optional(),
  surcharge_l: z.number().nonnegative().optional(),
  deskripsi: z.string().optional().nullable(),
  url_foto: z.string().optional().nullable(),
  tersedia: z.boolean().optional(),
});

export const UpdateMenuSchema = CreateMenuSchema.partial();
