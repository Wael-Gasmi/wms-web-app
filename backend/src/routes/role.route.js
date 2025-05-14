import express from "express";
import {
  addRole,
  deleteRole,
  getRoleById,
  updateRole,
  getRoles,
} from "../controllers/role.controller.js";
const router = express.Router();

router.post("/", addRole);
router.get("/", getRoles);
router.get("/:id", getRoleById);
router.patch("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
