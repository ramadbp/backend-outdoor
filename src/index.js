import { Hono } from "hono";

const app = new Hono();

// Tes koneksi API
app.get("/api", (c) => {
  return c.text("hi");
});

// GET semua alat
app.get("/api/alat", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM alat").all();
  return c.json(results);
});

// GET alat by ID
app.get("/api/alat/:id", async (c) => {
  const id = c.req.param("id");
  const { results } = await c.env.DB.prepare("SELECT * FROM alat WHERE id = ?")
    .bind(id)
    .all();
  return c.json(results[0] || {});
});

// POST tambah alat
app.post("/api/alat", async (c) => {
  const input = await c.req.json();
  const query = `INSERT INTO alat (nama, deskripsi, harga) VALUES ("${input.nama}", "${input.deskripsi}", "${input.harga}")`;
  const result = await c.env.DB.exec(query);
  return c.json(result);
});

// PUT update alat
app.put("/api/alat/:id", async (c) => {
  const id = c.req.param("id");
  const input = await c.req.json();
  const query = `UPDATE alat SET nama = "${input.nama}", deskripsi = "${input.deskripsi}", harga = "${input.harga}" WHERE id = "${id}"`;
  const result = await c.env.DB.exec(query);
  return c.json(result);
});

// DELETE alat
app.delete("/api/alat/:id", async (c) => {
  const id = c.req.param("id");
  const query = `DELETE FROM alat WHERE id = "${id}"`;
  const result = await c.env.DB.exec(query);
  return c.json(result);
});

// Static file handler jika ada
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
