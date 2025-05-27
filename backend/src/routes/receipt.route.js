import express from "express";
import {
  downloadReceiptPdf,
  getReceiptById,
  getReceipts,
  validateReceipt,
} from "../controllers/receipt.controller.js";

const router = express.Router();

router.get("/", getReceipts);
router.get("/:id", getReceiptById);
router.post("/:id/validate", validateReceipt);
router.get("/:id/pdf", downloadReceiptPdf);

export default router;
