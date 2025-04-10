import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { RowDataPacket } from "mysql2";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "kme@ns2025";

// Login;
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [
    username,
    hashedPassword,
  ]);
  res.json({ message: "User Created" });
});

// Get user berdasarkan token
router.get("/me", authenticate, async (req: any, res) => {
  try {
    const userId = req.userId; // ambil dari token

    const [rows]: any = await db.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [userId]
    );

    //console.log("rows", rows);

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
