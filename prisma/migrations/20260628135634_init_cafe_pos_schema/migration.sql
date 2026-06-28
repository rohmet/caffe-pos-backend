-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "kategori" VARCHAR(50) NOT NULL,
    "harga_dasar" INTEGER NOT NULL,
    "surcharge_m" INTEGER NOT NULL DEFAULT 0,
    "surcharge_l" INTEGER NOT NULL DEFAULT 0,
    "deskripsi" TEXT,
    "url_foto" TEXT,
    "tersedia" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi" (
    "id" TEXT NOT NULL,
    "no_invoice" VARCHAR(100) NOT NULL,
    "total" INTEGER NOT NULL,
    "bayar" INTEGER NOT NULL,
    "kembalian" INTEGER NOT NULL,
    "cashier_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi_item" (
    "id" TEXT NOT NULL,
    "transaksi_id" TEXT NOT NULL,
    "menu_id" TEXT,
    "nama_menu" VARCHAR(255) NOT NULL,
    "harga_satuan" INTEGER NOT NULL,
    "ukuran" VARCHAR(10) NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "transaksi_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaksi_no_invoice_key" ON "transaksi"("no_invoice");

-- AddForeignKey
ALTER TABLE "transaksi_item" ADD CONSTRAINT "transaksi_item_transaksi_id_fkey" FOREIGN KEY ("transaksi_id") REFERENCES "transaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_item" ADD CONSTRAINT "transaksi_item_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
