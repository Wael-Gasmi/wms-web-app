import express from "express";
import {
  getReceiptById,
  getReceipts,
} from "../controllers/receipt.controller.js";

const router = express.Router();

router.get("/", getReceipts);
router.get("/getReceiptProducts", getReceiptById);

export default router;
