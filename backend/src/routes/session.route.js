import express from "express";
import {
  addSession,
  deleteSession,
  getSessions,
  getSessionById,
  updateSession,
} from "../controllers/session.controller.js";

const router = express.Router();

router.post("/", addSession);
router.get("/", getSessions);
router.get("/:id", getSessionById);
router.patch("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;
