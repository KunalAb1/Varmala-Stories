import express from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

// POST /api/contact -> public contact form submission
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email and message are required" });
    }

    const entry = await ContactMessage.create({
      name,
      email,
      phone,
      eventType,
      eventDate,
      message,
    });

    res.status(201).json({ message: "Thanks! Your message has been sent.", id: entry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact -> list submissions (protect this route before going live, see README)
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
