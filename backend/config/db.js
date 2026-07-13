import mongoose from "mongoose";
import dns from "node:dns";

// Node's own DNS resolver sometimes ignores your system DNS settings on Windows
// (especially with VPN software, Docker, or virtual adapters installed), which breaks
// the mongodb+srv:// lookup even though `nslookup` from the terminal works fine.
// Forcing Google's DNS here fixes that mismatch.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}