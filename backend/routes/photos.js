import express from "express";
import Photo from "../models/Photo.js";
import { imagekit } from "../config/imagekit.js";

const router = express.Router();

// GET /api/photos?category=wedding&featured=true&album=<id or "none">
router.get("/", async (req, res) => {
  try {
    const { category, featured, album } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (album === "none") {
      filter.album = null; // photos not attached to any album
    } else if (album) {
      filter.album = album;
    }

    const photos = await Photo.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/photos/auth -> gives frontend a signature to upload directly to ImageKit
// (used by the admin upload page, not by public visitors)
router.get("/auth", (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/photos -> save metadata after the file has been uploaded to ImageKit
router.post("/", async (req, res) => {
  try {
    const { title, category, imageUrl, fileId, thumbnailUrl, location, date, isFeatured, order, album, width, height } = req.body;
    if (!title || !category || !imageUrl || !fileId) {
      return res.status(400).json({ error: "title, category, imageUrl and fileId are required" });
    }
    const photo = await Photo.create({
      title,
      category,
      imageUrl,
      fileId,
      thumbnailUrl,
      location,
      date,
      isFeatured,
      order,
      album: album || null,
      width,
      height,
    });
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/photos/:id -> removes from ImageKit and MongoDB
router.delete("/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    await imagekit.deleteFile(photo.fileId).catch(() => {
      // if it's already gone from ImageKit, don't block deleting the DB record
    });
    await photo.deleteOne();
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
