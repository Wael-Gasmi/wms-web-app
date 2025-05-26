import express from "express";
import {
  downloadReceiptPdf,
  getReceiptById,
  getReceipts,
} from "../controllers/receipt.controller.js";

const router = express.Router();

router.get("/", getReceipts);
router.get("/:id", getReceiptById);
router.get("/:id/pdf", downloadReceiptPdf);

export default router;
