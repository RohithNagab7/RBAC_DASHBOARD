import mongoose from "mongoose";

import User from "@/models/User";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ebani_tech";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function seedDatabase() {
  const superAdminEmail = "superadmin@test.com";
  const existingUser = await User.findOne({ email: superAdminEmail });

  if (!existingUser) {
    console.log("🌱 Seeding database: Creating Super Admin...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await User.create({
      name: "Super Admin",
      email: superAdminEmail,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    });
    console.log("✅ Super Admin created successfully.");
  }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      await seedDatabase();
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

if (process.env.NODE_ENV !== "test") {
  connectDB().catch((err) => console.error("Initial DB connection error:", err));
}
