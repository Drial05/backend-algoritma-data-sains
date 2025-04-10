import express from "express";
import { db } from "../db";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, username FROM users");

    res.json(rows);
  } catch (err) {
    console.log("Error Fetching user", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  console.log("fetching user with id", userId);

  try {
    const [rows]: any = await db.execute(
      "SELECT id, username FROM users WHERE id = ?",
      [userId]
    );

    console.log("rows", rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log("Error Fetching user", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
