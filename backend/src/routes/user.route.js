import express from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  resetPassword,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/", addUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.patch("/:id/reset-password", resetPassword);
router.delete("/:id", deleteUser);

export default router;
