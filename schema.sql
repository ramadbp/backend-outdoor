CREATE TABLE IF NOT EXISTS alat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  harga INTEGER NOT NULL
);
-- membuat migrasi untuk tabel alat
