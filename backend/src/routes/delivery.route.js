import express from "express";
import { getDeliveries } from "../controllers/delivery.controller.js";

const router = express.Router();

router.get("/", getDeliveries);

export default router;
