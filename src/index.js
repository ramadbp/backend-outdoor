export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // GET semua alat
    if (pathname === "/api/alat" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM alat").all();
      return jsonResponse(results);
    }

    // Tambah alat
    if (pathname === "/api/alat" && request.method === "POST") {
      const { nama, deskripsi, harga } = await request.json();
      await env.DB.prepare(
        "INSERT INTO alat (nama, deskripsi, harga) VALUES (?, ?, ?)"
      )
        .bind(nama, deskripsi, harga)
        .run();

      return new Response("Alat ditambahkan", {
        status: 201,
        headers: corsHeaders,
      });
    }

    // Update alat
    if (pathname.startsWith("/api/alat/") && request.method === "PUT") {
      const id = pathname.split("/").pop();
      const { nama, deskripsi, harga } = await request.json();
      await env.DB.prepare(
        "UPDATE alat SET nama = ?, deskripsi = ?, harga = ? WHERE id = ?"
      )
        .bind(nama, deskripsi, harga, id)
        .run();

      return new Response("Alat diperbarui", {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Hapus alat
    if (pathname.startsWith("/api/alat/") && request.method === "DELETE") {
      const id = pathname.split("/").pop();
      await env.DB.prepare("DELETE FROM alat WHERE id = ?").bind(id).run();

      return new Response("Alat dihapus", {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    });
  },
};

// ===== Helper =====
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function jsonResponse(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
}
