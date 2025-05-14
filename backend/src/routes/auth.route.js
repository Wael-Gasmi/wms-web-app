import express from "express";
import {
  login,
  signup,
  logout,
  isAuthenticated,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectroute.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/isAuthenticated", protectRoute, isAuthenticated);

export default router;
