import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import roleRoutes from "./routes/role.route.js";
import menuRoutes from "./routes/menu.route.js";
import sessionRoutes from "./routes/session.route.js";
import productRoutes from "./routes/product.route.js";
import ReceiptRoutes from "./routes/receipt.route.js";
import DeliveryRoutes from "./routes/delivery.route.js";
import LocationRoutes from "./routes/location.route.js";
import MovementRoutes from "./routes/movement.route.js";

const app = express();

dotenv.config();

app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: { action: "deny" },
  })
);

app.use(morgan("combined"));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/receipts", ReceiptRoutes);
app.use("/api/deliveries", DeliveryRoutes);
app.use("/api/locations", LocationRoutes);
app.use("/api/movements", MovementRoutes);

app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running on port ${PORT}`);
});
