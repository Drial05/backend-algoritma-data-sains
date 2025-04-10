import express from "express";
import { db } from "../db";
import { authenticate } from "../middleware/authMiddleware";
import { ResultSetHeader } from "mysql2";

const router = express.Router();

// ambil semua pelanggan
router.get("/", authenticate, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM customers");
  res.json(rows);
});

router.post("/add-customer", authenticate, async (req, res) => {
  const {
    nama,
    umur,
    pengeluaran,
    total_transaksi,
    rata_pengeluaran,
    jenis_kelamin,
    frekuensi,
    terakhir_transaksi,
  } = req.body;
  try {
    await db.execute(
      "INSERT INTO customers (nama, umur, pengeluaran, total_transaksi, rata_pengeluaran, jenis_kelamin, frekuensi, terakhir_transaksi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nama,
        umur,
        pengeluaran,
        total_transaksi,
        rata_pengeluaran,
        jenis_kelamin,
        frekuensi,
        terakhir_transaksi,
      ]
    );
    console.log("Data yang dikirim", req.body);
    res.json({ message: "Berhasil menambahkan customer" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan customer" });
  }
});

router.put("/update-customer/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    nama,
    umur,
    pengeluaran,
    total_transaksi,
    rata_pengeluaran,
    jenis_kelamin,
    frekuensi,
    terakhir_transaksi,
  } = req.body;

  // validasi sederhana
  if (!nama || typeof nama !== "string")
    return res.status(400).json({ message: "Nama harus diisi" });

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE customers set nama = ?, umur = ?, pengeluaran = ?, total_transaksi = ?, rata_pengeluaran = ?, jenis_kelamin = ?, frekuensi = ?, terakhir_transaksi = ? WHERE id = ?`,
      [
        nama,
        umur,
        pengeluaran,
        total_transaksi,
        rata_pengeluaran,
        jenis_kelamin,
        frekuensi,
        terakhir_transaksi,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    res.json({ message: "Customer berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengupdate customer" });
  }
});

router.delete("/delete-customer/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM customers WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    res.json({ message: "Customer berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus customer" });
  }
});

export default router;
