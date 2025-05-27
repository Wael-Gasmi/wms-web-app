import express from "express";
import { getMovements } from "../controllers/movement.controller.js";

const router = express.Router();

router.get("/", getMovements);

export default router;
