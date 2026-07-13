import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { transporter } from "../config/mailer.js";
import { requireAdminKey } from "../middleware/adminAuth.js";

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

    // Send an email notification — failure here should never block the form submission itself,
    // since the message is already safely saved in the database.
    transporter
      .sendMail({
        from: `"Varmala Stories Website" <${process.env.EMAIL_FROM}>`,
        to: process.env.NOTIFY_EMAIL,
        replyTo: email,
        subject: `New inquiry from ${name}`,
        text: `
New contact form submission on Varmala Stories:

Name: ${name}
Email: ${email}
Phone: ${phone || "—"}
Event type: ${eventType || "—"}
Event date: ${eventDate || "—"}

Message:
${message}
        `.trim(),
        html: `
          <h2>New inquiry from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "—"}</p>
          <p><strong>Event type:</strong> ${eventType || "—"}</p>
          <p><strong>Event date:</strong> ${eventDate || "—"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
      .catch((err) => console.error("Email notification failed:", err.message));

    res.status(201).json({ message: "Thanks! Your message has been sent.", id: entry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact -> list submissions — protected, requires the admin key header
router.get("/", requireAdminKey, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;