import express from "express";

import {
  registerUser,
  loginUser,
  googleLogin,
  getCurrentUser,
  getUsers,
  updateProfile,
  updateUserStatus,
  updateUserRole,
} from "../controllers/userController.js";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authenticate.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

// Logged-in user
router.get("/me", authenticate, getCurrentUser);
router.get("/profile", authenticate, getCurrentUser);
router.put("/profile", authenticate, updateProfile);

// Admin
router.get("/", authenticate, requireAdmin, getUsers);

router.put(
  "/status",
  authenticate,
  requireAdmin,
  updateUserStatus
);

router.put(
  "/role",
  authenticate,
  requireAdmin,
  updateUserRole
);

export default router;