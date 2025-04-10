import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import customerRoutes from "./routes/customers";
import clusterRoutes from "./routes/cluster";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/customers", customerRoutes);
app.use("/cluster", clusterRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
