import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js"; // adjust path if needed
import connectDB from "./src/db/index.js";

dotenv.config();

await connectDB();

const admin = new User({
  FullName: "Admin User",
  email: "admin@example.com",
  password: "admin123", // this will be hashed automatically
  role: "admin"
});

await admin.save(); // triggers pre-save hook and hashes password

console.log("✅ Admin created:", admin);
process.exit();
