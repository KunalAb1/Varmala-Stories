import "dotenv/config"; // must be first: loads .env before other files read process.env
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import photoRoutes from "./routes/photos.js";
import contactRoutes from "./routes/contact.js";
import albumRoutes from "./routes/albums.js";

const app = express();

// Allow requests from your Vercel frontend (set FRONTEND_URL in Render env vars)
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "VSAlex API is running" });
});

app.use("/api/photos", photoRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/albums", albumRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
