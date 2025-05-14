import express from "express";
import {
  addMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} from "../controllers/menu.controller.js";

const router = express.Router();

router.post("/", addMenu);
router.get("/", getMenus);
router.get("/:id", getMenuById);
router.patch("/:id", updateMenu);
router.delete("/:id", deleteMenu);

export default router;
