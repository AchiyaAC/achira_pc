import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || "");
const name = String(process.env.ADMIN_NAME || "System Admin").trim();

if (!email || password.length < 6) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 6 characters) in .env first.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
const hash = await bcrypt.hash(password, 12);
const existing = await User.findOne({ email }).select("+password");
if (existing) {
  existing.name = name || existing.name;
  existing.password = hash;
  existing.role = "admin";
  existing.isBlocked = false;
  await existing.save();
  console.log(`Admin updated: ${email}`);
} else {
  await User.create({ name, email, password: hash, role: "admin" });
  console.log(`Admin created: ${email}`);
}
await mongoose.disconnect();
