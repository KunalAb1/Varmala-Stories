import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["wedding", "prewedding", "haldi", "engagement", "models", "kids", "general", "hero"],
      default: "wedding",
    },
    imageUrl: { type: String, required: true }, // ImageKit URL
    fileId: { type: String, required: true }, // ImageKit fileId, needed to delete later
    width: { type: Number }, // actual pixel width, used to pick a matching grid tile shape
    height: { type: Number }, // actual pixel height, used to pick a matching grid tile shape
    thumbnailUrl: { type: String }, // optional pre-cropped thumb
    location: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false }, // show on homepage hero/highlights
    order: { type: Number, default: 0 }, // manual sort order within category
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", default: null }, // optional - which client album this belongs to
  },
  { timestamps: true }
);

export default mongoose.model("Photo", photoSchema);
