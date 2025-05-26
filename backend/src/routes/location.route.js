import express from "express";
import {
  getLocationById,
  getLocations,
} from "../controllers/location.controller.js";

const router = express.Router();

router.get("/", getLocations);
router.get("/:id", getLocationById);

export default router;
