import express from "express";
import Album from "../models/Album.js";
import Photo from "../models/Photo.js";
import { imagekit } from "../config/imagekit.js";

const router = express.Router();

// GET /api/albums?category=wedding -> list albums with their photo count + cover image
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const albums = await Album.find(filter).sort({ date: -1, createdAt: -1 });

    // Attach photo count + a fallback cover image for each album
    const albumsWithMeta = await Promise.all(
      albums.map(async (album) => {
        const count = await Photo.countDocuments({ album: album._id });
        let cover = album.coverImageUrl;
        if (!cover) {
          const firstPhoto = await Photo.findOne({ album: album._id }).sort({ createdAt: 1 });
          cover = firstPhoto?.imageUrl || null;
        }
        return { ...album.toObject(), photoCount: count, coverImageUrl: cover };
      })
    );

    res.json(albumsWithMeta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/albums/:id -> single album details
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/albums -> create a new album (e.g. "Mr & Mrs Sharma")
router.post("/", async (req, res) => {
  try {
    const { name, category, location, date, description, coverImageUrl } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "name and category are required" });
    }
    const album = await Album.create({ name, category, location, date, description, coverImageUrl });
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/albums/:id -> update album fields (used for setting a specific cover photo)
router.patch("/:id", async (req, res) => {
  try {
    const { coverImageUrl, name, location, date, description } = req.body;
    const update = {};
    if (coverImageUrl !== undefined) update.coverImageUrl = coverImageUrl;
    if (name !== undefined) update.name = name;
    if (location !== undefined) update.location = location;
    if (date !== undefined) update.date = date;
    if (description !== undefined) update.description = description;

    const album = await Album.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/albums/:id -> deletes the album AND every photo inside it (from ImageKit + MongoDB)
router.delete("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });

    const photos = await Photo.find({ album: album._id });
    for (const photo of photos) {
      await imagekit.deleteFile(photo.fileId).catch(() => {});
    }
    await Photo.deleteMany({ album: album._id });
    await album.deleteOne();

    res.json({ message: "Album and its photos deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
