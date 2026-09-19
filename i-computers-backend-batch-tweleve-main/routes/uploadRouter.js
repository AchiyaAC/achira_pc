import express from "express";
import upload from "../middleware/upload.js";
import { authenticate, requireAdmin } from "../middleware/authenticate.js";
import { uploadImageToCloudinary } from "../middleware/cloudinary.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  requireAdmin,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required.",
        });
      }

      const uploaded = await uploadImageToCloudinary(req.file);

      return res.status(201).json({
        success: true,
        url: uploaded.url,
        image: uploaded.url,
        file: uploaded.url,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
