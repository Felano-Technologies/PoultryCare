import express from "express";
import { register, login, getProfile } from "../controllers/authControllers.js";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: { message: "Too many login attempts. Please try again later." }
});

router.post("/register", register);
router.post('/login', loginLimiter, login);
router.get("/profile", authMiddleware, getProfile);

export default router;