import express from "express";
import { db } from "../db";
import { kMeansClustering } from "../utils/kmeans";
import { authenticate } from "../middleware/authMiddleware";

import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id, age, spending from customers"
  );
  const clusters = kMeansClustering(rows, 3);
  res.json(clusters);
});

export default router;
