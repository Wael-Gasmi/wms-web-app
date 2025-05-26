import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.get("/:id", getProductById);

export default router;
