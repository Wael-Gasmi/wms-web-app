import express from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/", addUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
